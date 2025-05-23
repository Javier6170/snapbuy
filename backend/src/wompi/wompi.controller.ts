import { Controller, Post, Headers, Body, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Controller('wompi')
export class WompiController {
  private readonly logger = new Logger(WompiController.name);
  private readonly integrityKey: string;

  constructor(private readonly config: ConfigService) {
    this.integrityKey = this.config.getOrThrow<string>('WOMPI_INTEGRITY_KEY');
  }

  @Post('events')
  async handleWebhook(
    @Body() body: any,
    @Headers('x-integrity') receivedHash: string,
  ) {
    const payloadString = JSON.stringify(body);
    const computedHash = crypto
      .createHmac('sha256', this.integrityKey)
      .update(payloadString)
      .digest('hex');

    if (computedHash !== receivedHash) {
      this.logger.warn('Firma de Wompi inválida');
      throw new BadRequestException('Firma no válida');
    }

    // Aquí puedes procesar el evento de Wompi
    this.logger.log(`Evento recibido de Wompi: ${JSON.stringify(body)}`);

    // Puedes usar body.transaction.id y body.event para actualizar tu base de datos
    return { received: true };
  }
}