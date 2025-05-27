// src/wompi/wompi.service.ts
import * as crypto from 'crypto';

import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { DeliveryInfoDto } from '../deliveries/dto/delivery-info.dto';

@Injectable()
export class WompiService {
  private readonly logger = new Logger(WompiService.name);
  private readonly apiUrl: string;
  private readonly privateKey: string;
  private readonly publicKey: string;
  private readonly integrityKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {
    this.apiUrl =
      this.config.get<string>('WOMPI_API') ||
      'https://api-sandbox.co.uat.wompi.dev/v1';
    this.privateKey = this.config.getOrThrow<string>(
      'WOMPI_PRIVATE_KEY',
    );
    this.publicKey = this.config.getOrThrow<string>(
      'WOMPI_PUBLIC_KEY',
    );
    this.integrityKey = this.config.getOrThrow<string>(
      'WOMPI_INTEGRITY_KEY',
    );

    this.logger.log(`WOMPI_API = ${this.apiUrl}`);
    this.logger.log(
      `WOMPI_PRIVATE_KEY = ${this.privateKey.slice(0, 6)}...`,
    );
    this.logger.log(
      `WOMPI_PUBLIC_KEY = ${this.publicKey.slice(0, 6)}...`,
    );
  }

  async getAcceptanceToken(): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.apiUrl}/merchants/${this.publicKey}`,
        ),
      );
      const token =
        response.data?.data?.presigned_acceptance
          ?.acceptance_token;
      if (!token) {
        throw new Error('No vino acceptance_token en la respuesta');
      }
      this.logger.log(`Acceptance token obtenido: ${token}`);
      return token;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const status =
        err.response?.status || HttpStatus.BAD_GATEWAY;
      const details = err.response?.data || err.message;
      this.logger.error(
        'Error al obtener acceptance_token:',
        details,
      );
      throw new HttpException(
        {
          message: 'No se pudo obtener el acceptance_token',
          details,
        },
        status,
      );
    }
  }

  async tokenizeCard(params: {
    number: string;
    cvc: string;
    exp_month: string;
    exp_year: string;
    card_holder: string;
  }): Promise<string> {
    const { number, cvc, exp_month, exp_year, card_holder } =
      params;
    const payload = { number, cvc, exp_month, exp_year, card_holder };

    this.logger.log(`Tokenizando tarjeta para: ${card_holder}`);
    this.logger.debug(`Payload: ${JSON.stringify(payload)}`);

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.apiUrl}/tokens/cards`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${this.publicKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );
      const token = response.data?.data?.id;
      if (!token) {
        throw new Error('No vino id de token en la respuesta');
      }
      this.logger.log(`Token generado: ${token}`);
      return token;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const status =
        err.response?.status === 422
          ? HttpStatus.UNPROCESSABLE_ENTITY
          : HttpStatus.BAD_REQUEST;
      const details = err.response?.data || err.message;
      this.logger.error(
        'Error al tokenizar tarjeta:',
        details,
      );
      throw new HttpException(
        {
          message: 'No se pudo tokenizar la tarjeta',
          details,
        },
        status,
      );
    }
  }

  // src/wompi/wompi.service.ts
async payWithCard(options: {
  amountInCents: number;
  customerEmail: string;
  reference: string;
  token: string;
  installments: number;
  deliveryInfo?: DeliveryInfoDto
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Promise<any> {
  const {
    amountInCents,
    customerEmail,
    reference,
    token,
    installments,
    deliveryInfo,
  } = options;

  const acceptanceToken = await this.getAcceptanceToken();
  const rawSignature = `${reference}${amountInCents}COP${this.integrityKey}`;
  const signature = crypto.createHash('sha256').update(rawSignature).digest('hex');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = {
    amount_in_cents: amountInCents,
    currency: 'COP',
    customer_email: customerEmail,
    reference,
    redirect_url: 'https://fake-return.com',
    acceptance_token: acceptanceToken,
    signature,
    payment_method: {
    type: 'CARD',
    token,
    installments,
  },
  shipping_data: {
    addressLine1: deliveryInfo?.addressLine1,
    addressLine2: deliveryInfo?.addressLine2,
    city:         deliveryInfo?.city,
    state:        deliveryInfo?.state,
    postal_code:  deliveryInfo?.postalCode,
    country:      deliveryInfo?.country,
    phone:        deliveryInfo?.phone,
  },

    // metadata siempre funciona:
    metadata: {
      delivery_address: deliveryInfo?.addressLine1,
      delivery_city:    deliveryInfo?.city,
      delivery_state:   deliveryInfo?.state,
      delivery_zip:     deliveryInfo?.postalCode,
      delivery_country: deliveryInfo?.country,
    },
  };

  this.logger.debug(`Payload: ${JSON.stringify(payload)}`);
  const response = await firstValueFrom(
    this.httpService.post(`${this.apiUrl}/transactions`, payload, {
      headers: {
        Authorization: `Bearer ${this.privateKey}`,
        'Content-Type': 'application/json',
      },
    }),
  );
  return response.data;
}


  async getTransactionStatus(
    transactionId: string,
  ): Promise<
    'APPROVED' | 'DECLINED' | 'PENDING' | 'VOIDED' | 'ERROR'
  > {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.apiUrl}/transactions/${transactionId}`,
          {
            headers: {
              Authorization: `Bearer ${this.privateKey}`,
            },
          },
        ),
      );
      return response.data?.data?.status;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const status =
        err.response?.status || HttpStatus.BAD_GATEWAY;
      const details = err.response?.data || err.message;
      this.logger.error(
        'Error al consultar estado de transacción:',
        details,
      );
      throw new HttpException(
        {
          message: 'No se pudo obtener estado de la transacción',
          details,
        },
        status,
      );
    }
  }
}
