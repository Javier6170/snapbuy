// src/deliveries/dto/create-delivery.dto.ts
import { IsUUID, IsInt, Min, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { DeliveryInfoDto } from './delivery-info.dto';

export class CreateDeliveryDto {
  @ApiProperty({ description: 'UUID de la transacción asociada' })
  @IsUUID() transactionId: string;

  @ApiProperty({ description: 'UUID del cliente' })
  @IsUUID() customerId: string;

  @ApiProperty({ description: 'UUID del producto' })
  @IsUUID() productId: string;

  @ApiProperty({ description: 'Cantidad a entregar', minimum: 1 })
  @IsInt() @Min(1) quantity: number;

  @ApiProperty({ description: 'Información de envío', type: DeliveryInfoDto })
  @ValidateNested()
  @Type(() => DeliveryInfoDto)
  deliveryInfo: DeliveryInfoDto;
}
