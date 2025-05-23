import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';

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
    this.apiUrl = this.config.get<string>('WOMPI_API') || 'https://api-sandbox.co.uat.wompi.dev/v1';
    this.privateKey = this.config.getOrThrow<string>('WOMPI_PRIVATE_KEY');
    this.publicKey = this.config.getOrThrow<string>('WOMPI_PUBLIC_KEY');
    this.integrityKey = this.config.getOrThrow<string>('WOMPI_INTEGRITY_KEY');

    this.logger.log(`WOMPI_API = ${this.apiUrl}`);
    this.logger.log(`WOMPI_PRIVATE_KEY = ${this.privateKey.slice(0, 6)}...`);
    this.logger.log(`WOMPI_PUBLIC_KEY = ${this.publicKey.slice(0, 6)}...`);
  }

  async getAcceptanceToken(): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.apiUrl}/merchants/${this.publicKey}`),
      );
      const token = response.data?.data?.presigned_acceptance?.acceptance_token;
      this.logger.log(`Acceptance token obtenido: ${token}`);
      return token;
    } catch (err: any) {
      this.logger.error(`Error al obtener acceptance_token: ${err.message}`);
      if (err?.response?.data) {
        this.logger.error(`Detalles: ${JSON.stringify(err.response.data)}`);
      }
      throw new Error('No se pudo obtener el acceptance_token');
    }
  }

  async tokenizeCard({
    number,
    cvc,
    exp_month,
    exp_year,
    card_holder,
  }: {
    number: string;
    cvc: string;
    exp_month: string;
    exp_year: string;
    card_holder: string;
  }): Promise<string> {
    const payload = { number, cvc, exp_month, exp_year, card_holder };
    this.logger.log(`Tokenizando tarjeta para: ${card_holder}`);
    this.logger.log(`Payload: ${JSON.stringify(payload)}`);

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/tokens/cards`, payload, {
          headers: {
            Authorization: `Bearer ${this.publicKey}`,
            'Content-Type': 'application/json',
          },
        }),
      );
      const token = response.data?.data?.id;
      this.logger.log(`Token generado: ${token}`);
      return token;
    } catch (err: any) {
      this.logger.error(`Error al tokenizar tarjeta: ${err.message}`);
      if (err?.response?.data) {
        this.logger.error(`Detalles del error: ${JSON.stringify(err.response.data)}`);
      }
      throw new Error('No se pudo tokenizar la tarjeta');
    }
  }

  async payWithCard({
    amountInCents,
    customerEmail,
    reference,
    token,
    installments,
  }: {
    amountInCents: number;
    customerEmail: string;
    reference: string;
    token: string;
    installments: number;
  }) {
    const acceptanceToken = await this.getAcceptanceToken();

    // Firma de integridad con orden correcto: reference + amount + currency + integrityKey
    const rawSignature = `${reference}${amountInCents}COP${this.integrityKey}`;
    const signature = crypto.createHash('sha256').update(rawSignature).digest('hex');
    this.logger.log(`Firma SHA256 generada: ${signature}`);

    const payload = {
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
    };

    this.logger.log(`Payload enviado a Wompi: ${JSON.stringify(payload)}`);
    this.logger.log(`Usando endpoint: ${this.apiUrl}/transactions`);

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.apiUrl}/transactions`, payload, {
          headers: {
            Authorization: `Bearer ${this.privateKey}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      return response.data;
    } catch (err: any) {
      this.logger.error(`Error al crear la transacción: ${err.message}`);
      if (err?.response?.data) {
        this.logger.error(`Detalles del error: ${JSON.stringify(err.response.data)}`);
      }
      throw new Error('No se pudo procesar el pago con Wompi');
    }
  }

  async getTransactionStatus(transactionId: string): Promise<'APPROVED' | 'DECLINED' | 'PENDING' | 'VOIDED' | 'ERROR'> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.apiUrl}/transactions/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${this.privateKey}`,
        },
      }),
    );
    return response.data?.data?.status;
  }
}
