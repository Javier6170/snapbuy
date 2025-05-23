/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';
import { TransactionsModule } from './transactions/transactions.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import ormconfig from './config/ormconfig';
import { ConfigModule } from '@nestjs/config';
import { PaymentsModule } from './payment/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TypeOrmModule.forRoot(ormconfig),
    ProductsModule,
    CustomersModule,
    TransactionsModule,
    DeliveriesModule,
    PaymentsModule
  ],
})
export class AppModule {}
