 
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';
import { TransactionsModule } from './transactions/transactions.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { PaymentsModule } from './payment/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        synchronize: config.get<boolean>('DB_SYNCHRONIZE'),
        entities: ['dist/**/*.entity.js'],
      }),
    }),

    ProductsModule,
    CustomersModule,
    TransactionsModule,
    DeliveriesModule,
    PaymentsModule,
  ],
})
export class AppModule {}
