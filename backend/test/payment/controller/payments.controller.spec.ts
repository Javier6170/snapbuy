// test/payments/payments.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';

import { PaymentsService } from '../../../src/payment/payments.service';
import { PaymentsModule } from '../../../src/payment/payments.module';
import { HttpExceptionFilter } from '../../../src/common/filters/http-exception.filter';
import { LoggingInterceptor } from '../../../src/common/interceptors/logging.interceptor';
import { CreatePaymentDto } from '../../../src/payment/dto/create-payment.dto';
import { PaymentsController } from '../../../src/payment/payments.controller';
import { DeliveryInfoDto } from '../../../src/deliveries/dto/delivery-info.dto';

describe('PaymentsController (e2e)', () => {
  let app: INestApplication;
  const mockService = {
    processPayment: jest
      .fn()
      .mockResolvedValue({ transactionId: 'tx-123', status: 'APPROVED' }),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [{ provide: PaymentsService, useValue: mockService }],
    }).compile();

    app = module.createNestApplication();
    app.enableCors({ origin: ['*'], credentials: true });
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const validDto: CreatePaymentDto = {
    customerId: '550e8400-e29b-41d4-a716-446655440000', // UUID v4
    products: [
      {
        productId: '3fa85f64-5717-4562-b3fc-2c963f66afa6', // UUID v4
        quantity: 2,
      },
    ],
    customerEmail: 'test@example.com',               
    amountInCents: 5000,                            
    cardNumber: '4111111111111111',                  
    cvc: '123',                                      
    expMonth: '12',                                  
    expYear: '30',                                  
    name: 'Test User',                               
    documentType: 'CC',                              
    documentNumber: '1234567890',                    
    installments: 1,                                 
    deliveryInfo: {
      addressLine1: '12345 Street',                 
      city: 'City',                                  
      state: 'State',                                
      postalCode: '0001',                           
      country: 'Co',                                 
    },
  };

  it('POST /api/payments → 201', () => {
    return request(app.getHttpServer())
      .post('/api/payments')
      .send(validDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(mockService.processPayment).toHaveBeenCalledWith(validDto);
        expect(body).toEqual({ transactionId: 'tx-123', status: 'APPROVED' });
      });
  });
});