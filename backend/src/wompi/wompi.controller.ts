import * as crypto from 'crypto';

import { Controller, Post, Headers, Body, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiHeader, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Wompi Webhooks')
@Controller('wompi')
export class WompiController {
  private readonly logger = new Logger(WompiController.name);
  private readonly integrityKey: string;

  constructor(private readonly config: ConfigService) {
    this.integrityKey = this.config.getOrThrow<string>('WOMPI_INTEGRITY_KEY');
  }

  @Post('events')
  @ApiOperation({ summary: 'Recibe eventos de Wompi' })
  @ApiHeader({
    name: 'x-integrity',
    description: 'Hash SHA256 HMAC del payload',
    required: true,
    schema: { type: 'string', example: '37c8407747e595535433ef8f6a811d853cd943046624a0ec04662b17bbf33bf5' },
  })
  @ApiBody({ description: 'Payload que envía Wompi en el webhook', schema: { type: 'object' } })
  @ApiResponse({ status: 200, description: 'Evento procesado correctamente', schema: { example: { received: true } } })
  @ApiResponse({ status: 400, description: 'Firma no válida' })
  async handleWebhook(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    this.logger.log(`Evento recibido de Wompi: ${JSON.stringify(body)}`);
    return { received: true };
  }
}
