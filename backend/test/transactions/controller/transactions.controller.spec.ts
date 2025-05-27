// test/transactions/transactions.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import * as request from 'supertest';
import { TransactionsController } from '../../../src/transactions/transactions.controller';
import { TransactionsService } from '../../../src/transactions/transactions.service';
import { InternalCreateTransactionDto } from '../../../src/transactions/dto/internal-create-transaction.dto';
import { UpdateTransactionDto } from '../../../src/transactions/dto/update-transaction.dto';


describe('TransactionsController (e2e)', () => {
  let app: INestApplication;

  const sampleTransaction = {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    customerId: '2b29d781-b4a4-419c-a2c5-96ddc444dd20',
    status: 'PENDING' as const,
    amountInCents: 258000,
    reference: 'ref-1748017213426',
    documentType: 'CC',
    documentNumber: '123456',
    installments: 1,
    createdAt: new Date('2025-05-23T16:20:20.819Z'),
    updatedAt: new Date('2025-05-23T16:22:45.123Z'),
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(sampleTransaction),
    update: jest.fn().mockResolvedValue({ ...sampleTransaction, status: 'APPROVED' }),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [{ provide: TransactionsService, useValue: mockService }],
    }).compile();

    app = module.createNestApplication();
    // Quitamos forbidNonWhitelisted para que `status` pase sin tener decorador
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true /*, forbidNonWhitelisted: false*/ }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /transactions → 201 Created', () => {
    const dto: InternalCreateTransactionDto = {
      customerId: sampleTransaction.customerId,
      amountInCents: sampleTransaction.amountInCents,
      status: sampleTransaction.status,
      reference: sampleTransaction.reference,
    };

    return request(app.getHttpServer())
      .post('/transactions')
      .send(dto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(mockService.create).toHaveBeenCalledWith(dto);
        expect(body).toEqual({
          ...dto,
          id: sampleTransaction.id,
          documentType: sampleTransaction.documentType,
          documentNumber: sampleTransaction.documentNumber,
          installments: sampleTransaction.installments,
          createdAt: sampleTransaction.createdAt.toISOString(),
          updatedAt: sampleTransaction.updatedAt.toISOString(),
        });
      });
  });

  it('PATCH /transactions/:id → 200 OK with updated status', () => {
    const dto: UpdateTransactionDto = { status: 'APPROVED' };
    const updated = { ...sampleTransaction, status: 'APPROVED' };
    mockService.update.mockResolvedValueOnce(updated);

    return request(app.getHttpServer())
      .patch(`/transactions/${sampleTransaction.id}`)
      .send(dto)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(mockService.update).toHaveBeenCalledWith(sampleTransaction.id, dto);
        expect(body).toEqual({
          ...updated,
          createdAt: updated.createdAt.toISOString(),
          updatedAt: updated.updatedAt.toISOString(),
        });
      });
  });

  it('PATCH /transactions/:id → 404 Not Found when service throws', () => {
    const dto: UpdateTransactionDto = { status: 'FAILED' };
    mockService.update.mockRejectedValueOnce(new NotFoundException('Not found'));

    return request(app.getHttpServer())
      .patch(`/transactions/${sampleTransaction.id}`)
      .send(dto)
      .expect(HttpStatus.NOT_FOUND);
  });
});