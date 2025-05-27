/* eslint-disable @typescript-eslint/no-explicit-any */
// test/payments/payments.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';

import { PaymentsService } from '../../../src/payment/payments.service';
import { WompiService } from '../../../src/wompi/wompi.service';
import { TransactionsService } from '../../../src/transactions/transactions.service';
import { DeliveriesService } from '../../../src/deliveries/deliveries.service';
import { ProductsService } from '../../../src/products/products.service';
import { CreatePaymentDto } from '../../../src/payment/dto/create-payment.dto';

jest.setTimeout(60000);

describe('PaymentsService', () => {
  let service: PaymentsService;
  let wompi: jest.Mocked<WompiService>;
  let txSvc: jest.Mocked<TransactionsService>;
  let delSvc: jest.Mocked<DeliveriesService>;
  let prodSvc: jest.Mocked<ProductsService>;

  // Silenciamos logger.error (y logger.log si quisieras) para no ensuciar la salida
  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: WompiService,
          useValue: {
            tokenizeCard: jest.fn(),
            payWithCard: jest.fn(),
            getTransactionStatus: jest.fn(),
          },
        },
        {
          provide: TransactionsService,
          useValue: { create: jest.fn(), updateStatus: jest.fn() },
        },
        { provide: DeliveriesService, useValue: { create: jest.fn() } },
        { provide: ProductsService, useValue: { updateStock: jest.fn() } },
      ],
    }).compile();

    service = module.get(PaymentsService);
    wompi = module.get(WompiService);
    txSvc = module.get(TransactionsService);
    delSvc = module.get(DeliveriesService);
    prodSvc = module.get(ProductsService);
  });

  const dto: CreatePaymentDto = {
    customerId: 'cust-1',
    products: [{ productId: 'prod-1', quantity: 2 }],
    customerEmail: 'e@e.com',
    amountInCents: 2000,
    cardNumber: '4111111111111111',
    cvc: '123',
    expMonth: '12',
    expYear: '30',
    name: 'User',
    documentType: 'CC',
    documentNumber: '123',
    installments: 1,
    deliveryInfo: {
      addressLine1: 'St',   // aquí no importa la validación, es un unit-test directo
      city: 'C',
      state: 'S',
      postalCode: '000',
      country: 'Col',
    },
  };

  it('should process and approve immediately', async () => {
    txSvc.create.mockResolvedValueOnce({ id: 'tx-1' } as any);
    wompi.tokenizeCard.mockResolvedValueOnce('tok-1');
    wompi.payWithCard.mockResolvedValueOnce({
      data: { id: 'wtx', status: 'APPROVED' },
    } as any);

    const res = await service.processPayment(dto);

    expect(res).toEqual({ transactionId: 'tx-1', status: 'APPROVED' });
    expect(txSvc.updateStatus).toHaveBeenCalledWith('tx-1', 'APPROVED');
    expect(delSvc.create).toHaveBeenCalledTimes(1);
    expect(prodSvc.updateStock).toHaveBeenCalledTimes(1);
  });

  it(
    'should retry PENDING then fail',
    async () => {
      txSvc.create.mockResolvedValueOnce({ id: 'tx-2' } as any);
      wompi.tokenizeCard.mockResolvedValueOnce('tok-2');
      wompi.payWithCard.mockResolvedValueOnce({
        data: { id: 'wtx2', status: 'PENDING' },
      } as any);
      wompi.getTransactionStatus.mockResolvedValueOnce('ERROR');

      const res = await service.processPayment(dto);

      expect(res).toEqual({ transactionId: 'tx-2', status: 'FAILED' });
      expect(txSvc.updateStatus).toHaveBeenCalledWith('tx-2', 'FAILED');
      expect(delSvc.create).not.toHaveBeenCalled();
      expect(prodSvc.updateStock).not.toHaveBeenCalled();
    },
    60000
  );

  it('should throw on unexpected error', async () => {
    txSvc.create.mockRejectedValueOnce(new Error('boom'));
    await expect(service.processPayment(dto)).rejects.toMatchObject({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  });
});