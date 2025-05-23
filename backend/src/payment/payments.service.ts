import { Injectable, Logger } from '@nestjs/common';
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

    const transaction = await this.transactions.create({
      ...dto,
      status: 'PENDING',
      reference,
    });

    const token = await this.wompi.tokenizeCard({
      number: dto.cardNumber,
      cvc: dto.cvc,
      exp_month: dto.expMonth,
      exp_year: dto.expYear,
      card_holder: dto.name,
    });

    const result = await this.wompi.payWithCard({
      amountInCents: dto.amountInCents,
      customerEmail: dto.customerEmail,
      reference,
      token,
      installments: 1,
    });

    const transactionId = result?.data?.id;
    let finalStatus = result?.data?.status;
    
    if (finalStatus === 'PENDING') {
      await new Promise(res => setTimeout(res, 5000)); // esperar 5 segundos
      finalStatus = await this.wompi.getTransactionStatus(transactionId);
    }

    const status = finalStatus === 'APPROVED' ? 'APPROVED' : 'FAILED';
    await this.transactions.updateStatus(transaction.id, status);

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
  }
}
