import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { WompiService } from '../wompi/wompi.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { TransactionsService } from '../transactions/transactions.service';
import { DeliveriesService } from '../deliveries/deliveries.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class PaymentsService {

    private readonly logger = new Logger(WompiService.name);

  constructor(
    private wompi: WompiService,
    private transactions: TransactionsService,
    private deliveries: DeliveriesService,
    private products: ProductsService,
    
  ) {}

   async processPayment(dto: CreatePaymentDto) {
    const reference = `ref-${Date.now()}`;

    try {
      // 1. Crear registro de transacción en estado PENDING
      const transaction = await this.transactions.create({
        ...dto,
        status: 'PENDING',
        reference,
      });

      // 2. Tokenizar tarjeta
      const token = await this.wompi.tokenizeCard({
        number: dto.cardNumber,
        cvc: dto.cvc,
        exp_month: dto.expMonth,
        exp_year: dto.expYear,
        card_holder: dto.name,
      });

      // 3. Enviar pago a Wompi
      const result = await this.wompi.payWithCard({
        amountInCents: dto.amountInCents,
        customerEmail: dto.customerEmail,
        reference,
        token,
        installments: 1,
      });

      // 4. Si queda PENDING, esperar un poco y volver a consultar
      let finalStatus = result?.data?.status;
      if (finalStatus === 'PENDING') {
        await new Promise(res => setTimeout(res, 5000)); // 5s
        finalStatus = await this.wompi.getTransactionStatus(result.data.id);
      }

      // 5. Actualizar estado interno
      const status = finalStatus === 'APPROVED' ? 'APPROVED' : 'FAILED';
      await this.transactions.updateStatus(transaction.id, status);

      // 6. En caso de éxito, crear entrega y decrementar stock
      if (status === 'APPROVED') {
        await this.deliveries.create({
          transactionId: transaction.id,
          customerId: dto.customerId,
          productId: dto.productId,
          quantity: dto.quantity,
        });
        await this.products.updateStock(dto.productId, dto.quantity);
      }

      return { transactionId: transaction.id, status };
    } catch (err: any) {
      this.logger.error(`Error en processPayment: ${err.message}`, err.stack);

      // Si ya es HttpException, relanzar tal cual
      if (err instanceof HttpException) {
        throw err;
      }

      // En otro caso, envolver en 500
      throw new HttpException(
        {
          message: 'Error procesando pago',
          details: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
