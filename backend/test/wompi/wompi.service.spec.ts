import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import * as nock from 'nock';

import { WompiService } from '../../src/wompi/wompi.service';
import { DeliveryInfoDto } from '../../src/deliveries/dto/delivery-info.dto';

describe('WompiService Integration', () => {
  let service: WompiService;
  let config: ConfigService;

  const WOMPI_API = 'https://api-sandbox.co.uat.wompi.dev/v1';
  const PUBLIC_KEY = 'pub_stagtest_test';
  const PRIVATE_KEY = 'prv_stagtest_test';
  const INTEGRITY_KEY = 'stagtest_integrity_test';

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        WompiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key) => {
              switch (key) {
                case 'WOMPI_API':
                  return WOMPI_API;
                case 'WOMPI_PUBLIC_KEY':
                  return PUBLIC_KEY;
                case 'WOMPI_PRIVATE_KEY':
                  return PRIVATE_KEY;
                case 'WOMPI_INTEGRITY_KEY':
                  return INTEGRITY_KEY;
                default:
                  return null;
              }
            }),
            getOrThrow: jest.fn().mockImplementation((key) => {
              switch (key) {
                case 'WOMPI_PUBLIC_KEY':
                  return PUBLIC_KEY;
                case 'WOMPI_PRIVATE_KEY':
                  return PRIVATE_KEY;
                case 'WOMPI_INTEGRITY_KEY':
                  return INTEGRITY_KEY;
                default:
                  throw new Error(`${key} no está configurado`);
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<WompiService>(WompiService);
    config = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should get acceptance token', async () => {
    const mockToken = 'mocked_acceptance_token';

    nock(WOMPI_API)
      .get(`/merchants/${PUBLIC_KEY}`)
      .reply(200, {
        data: {
          presigned_acceptance: { acceptance_token: mockToken },
        },
      });

    const token = await service.getAcceptanceToken();
    expect(token).toEqual(mockToken);
  });

  it('should tokenize a card', async () => {
    const mockCardToken = 'mocked_card_token';

    nock(WOMPI_API)
      .post('/tokens/cards')
      .reply(200, { data: { id: mockCardToken } });

    const token = await service.tokenizeCard({
      number: '4111111111111111',
      cvc: '123',
      exp_month: '12',
      exp_year: '30',
      card_holder: 'John Doe',
    });

    expect(token).toEqual(mockCardToken);
  });

  it('should successfully pay with card', async () => {
    const acceptanceToken = 'mocked_acceptance_token';
    const transactionId = 'mocked_transaction_id';

    // Mock para acceptance token
    nock(WOMPI_API)
      .get(`/merchants/${PUBLIC_KEY}`)
      .reply(200, {
        data: {
          presigned_acceptance: { acceptance_token: acceptanceToken },
        },
      });

    // Mock para transacción de pago
    nock(WOMPI_API)
      .post('/transactions')
      .reply(200, { data: { id: transactionId, status: 'APPROVED' } });

    const result = await service.payWithCard({
      amountInCents: 5000,
      customerEmail: 'customer@test.com',
      reference: 'ref-123',
      token: 'tokenized_card',
      installments: 1,
      deliveryInfo: {
        addressLine1: 'Calle 123',
        city: 'Bogotá',
        state: 'Bogotá DC',
        postalCode: '110111',
        country: 'CO',
        phone: '3001234567',
      } as DeliveryInfoDto,
    });

    expect(result.data.id).toEqual(transactionId);
    expect(result.data.status).toEqual('APPROVED');
  });

  it('should retrieve transaction status', async () => {
    const transactionId = 'mocked_transaction_id';

    nock(WOMPI_API)
      .get(`/transactions/${transactionId}`)
      .reply(200, { data: { status: 'APPROVED' } });

    const status = await service.getTransactionStatus(transactionId);

    expect(status).toEqual('APPROVED');
  });

  it('should handle failure when tokenize card', async () => {
    nock(WOMPI_API)
      .post('/tokens/cards')
      .reply(422, { error: 'Invalid card data' });

    await expect(
      service.tokenizeCard({
        number: 'invalid',
        cvc: '123',
        exp_month: '12',
        exp_year: '30',
        card_holder: 'John Doe',
      }),
    ).rejects.toThrow('No se pudo tokenizar la tarjeta');
  });
});
