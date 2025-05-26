// src/payments/payments.service.ts
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { WompiService } from '../wompi/wompi.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { TransactionsService } from '../transactions/transactions.service';
import { DeliveriesService } from '../deliveries/deliveries.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private wompi: WompiService,
    private transactions: TransactionsService,
    private deliveries: DeliveriesService,
    private products: ProductsService,
  ) {}

  async processPayment(dto: CreatePaymentDto): Promise<{ transactionId: string; status: 'APPROVED' | 'FAILED' }> {
    const reference = `ref-${Date.now()}`;

    try {
      // 1. Crear transacción PENDING, incluyendo los nuevos campos
      const transaction = await this.transactions.create({
        ...dto,
        status: 'PENDING',
        reference,
      });

      // 2. Tokenizar la tarjeta en Wompi
      const token = await this.wompi.tokenizeCard({
        number:     dto.cardNumber,
        cvc:        dto.cvc,
        exp_month:  dto.expMonth,
        exp_year:   dto.expYear,
        card_holder:dto.name,
      });

      // 3. Enviar el pago, ahora con dto.installments
      const result = await this.wompi.payWithCard({
        amountInCents: dto.amountInCents,
        customerEmail: dto.customerEmail,
        reference,
        token,
        installments: dto.installments,
        deliveryInfo: dto.deliveryInfo
      });

      // 4. Si queda PENDING, esperar y volver a consultar
      let finalStatus = result?.data?.status;
      if (finalStatus === 'PENDING') {
        await new Promise(res => setTimeout(res, 5000));
        finalStatus = await this.wompi.getTransactionStatus(result.data.id);
      }

      // 5. Actualizar estado de la transacción
      const status = finalStatus === 'APPROVED' ? 'APPROVED' : 'FAILED';
      await this.transactions.updateStatus(transaction.id, status);

      // 6. Si se aprueba, crear entregas y ajustar stock
      if (status === 'APPROVED') {
        for (const item of dto.products) {
          await this.deliveries.create({
            transactionId: transaction.id,
            customerId:    dto.customerId,
            productId:     item.productId,
            quantity:      item.quantity,
            deliveryInfo:  dto.deliveryInfo
          });
          await this.products.updateStock(item.productId, item.quantity);
        }
      }

      return { transactionId: transaction.id, status };
    } catch (err: any) {
      this.logger.error(`Error en processPayment: ${err.message}`, err.stack);
      if (err instanceof HttpException) throw err;

      throw new HttpException(
        { message: 'Error procesando pago', details: err.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
