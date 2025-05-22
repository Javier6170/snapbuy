/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';
import { TransactionsModule } from './transactions/transactions.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import ormconfig from './config/ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    ProductsModule,
    CustomersModule,
    TransactionsModule,
    DeliveriesModule,
  ],
})
export class AppModule {}
