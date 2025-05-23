// src/payments/payments.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Procesar un pago con tarjeta' })
  @ApiBody({ type: CreatePaymentDto })
  @ApiResponse({
    status: 201,
    description: 'Pago procesado correctamente. Devuelve el ID de la transacción y su estado.',
    schema: {
      example: {
        transactionId: 'd9f3a0e2-1234-4567-89ab-cdef01234567',
        status: 'APPROVED',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 500, description: 'Error interno al procesar el pago' })
  async create(@Body() dto: CreatePaymentDto) {
    return this.service.processPayment(dto);
  }
}
