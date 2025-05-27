import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { WompiService } from '../wompi/wompi.service';
import { TransactionsModule } from '../transactions/transactions.module';
import { DeliveriesModule } from '../deliveries/deliveries.module';
import { ProductsModule } from '../products/products.module';

import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

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