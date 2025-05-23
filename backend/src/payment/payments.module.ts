import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { WompiService } from '../wompi/wompi.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { TransactionsModule } from '../transactions/transactions.module';
import { DeliveriesModule } from '../deliveries/deliveries.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    TransactionsModule,
    DeliveriesModule,
    ProductsModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, WompiService],
})
export class PaymentsModule {}