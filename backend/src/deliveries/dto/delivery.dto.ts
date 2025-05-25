// src/deliveries/dto/delivery.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class DeliveryDto {
  @ApiProperty({ description: 'UUID de la entrega' })
  id: string;

  @ApiProperty({ description: 'UUID de la transacción' })
  transactionId: string;

  @ApiProperty({ description: 'UUID del cliente' })
  customerId: string;

  @ApiProperty({ description: 'UUID del producto' })
  productId: string;

  @ApiProperty({ description: 'Cantidad entregada' })
  quantity: number;

  @ApiProperty({ description: 'Fecha de creación', format: 'date-time' })
  createdAt: Date;
}
