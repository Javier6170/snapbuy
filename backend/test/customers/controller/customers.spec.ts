// test/customers.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomersModule } from '../../../src/customers/customers.module';
import { Customer } from '../../../src/customers/entities/customer.entity';
import { HttpExceptionFilter } from '../../../src/common/filters/http-exception.filter';
import { LoggingInterceptor } from '../../../src/common/interceptors/logging.interceptor';

describe('CustomersController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Customer],
          synchronize: true,
        }),
        CustomersModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    // replicate your bootstrap setup
    app.enableCors({ origin: ['*'], credentials: true });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const customerPayload = {
    name: 'Test User',
    address: '123 Main St',
    email: 'test@example.com',
    documentType: 'CC',
    documentNumber: '987654321',
  };

  it('POST /api/customers → 201', () => {
    return request(app.getHttpServer())
      .post('/api/customers')
      .send(customerPayload)
      .expect(201)
      .then(({ body }) => {
        expect(body).toHaveProperty('id');
        expect(body.name).toBe(customerPayload.name);
        createdId = body.id;
      });
  });

  it('GET /api/customers/:id → 200', () => {
    return request(app.getHttpServer())
      .get(`/api/customers/${createdId}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBe(createdId);
        expect(body.email).toBe(customerPayload.email);
      });
  });

  it('PATCH /api/customers/:id → 200', () => {
    const updatePayload = { address: '456 Elm St' };
    return request(app.getHttpServer())
      .patch(`/api/customers/${createdId}`)
      .send(updatePayload)
      .expect(200)
      .then(({ body }) => {
        expect(body.id).toBe(createdId);
        expect(body.address).toBe(updatePayload.address);
      });
  });
});
