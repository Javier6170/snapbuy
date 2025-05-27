// src/payments/dto/create-payment.dto.ts
import {
  IsUUID, IsEmail, IsInt, Min, IsString, ValidateNested,
  ArrayNotEmpty, IsPositive, IsDefined,
  Length
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { DeliveryInfoDto } from '../../deliveries/dto/delivery-info.dto';

import { ProductOrderDto } from './product-order.dto';

export class CreatePaymentDto {
  @ApiProperty({ description: 'UUID del cliente', format: 'uuid' })
  @IsUUID() customerId: string;

  @ApiProperty({ description: 'Productos y cantidades', type: [ProductOrderDto] })
  @ValidateNested({ each: true })
  @Type(() => ProductOrderDto)
  @ArrayNotEmpty()
  products: ProductOrderDto[];

  @ApiProperty({ description: 'Email de contacto', format: 'email' })
  @IsEmail() customerEmail: string;

  @ApiProperty({ description: 'Monto total en centavos (COP)', minimum: 100 })
  @IsInt() @Min(100) amountInCents: number;

  @ApiProperty({ description: 'Número de tarjeta (16 dígitos)' })
  @IsString() @Length(16, 16) cardNumber: string;

  @ApiProperty({ description: 'CVC (3 o 4 dígitos)' })
  @IsString() @Length(3, 4) cvc: string;

  @ApiProperty({ description: 'Mes de expiración (MM)' })
  @IsString() @Length(2, 2) expMonth: string;

  @ApiProperty({ description: 'Año de expiración (YY)' })
  @IsString() @Length(2, 2) expYear: string;

  @ApiProperty({ description: 'Nombre en la tarjeta' })
  @IsString() name: string;

  @ApiProperty({ description: 'Tipo de documento', example: 'CC' })
  @IsString() documentType: string;

  @ApiProperty({ description: 'Número de documento' })
  @IsString() documentNumber: string;

  @ApiProperty({ description: 'Número de cuotas', minimum: 1 })
  @IsInt() @Min(1) installments: number;

  @ApiProperty({ description: 'Información de entrega', type: DeliveryInfoDto })
  @IsDefined()
  @ValidateNested()
  @Type(() => DeliveryInfoDto)
  deliveryInfo: DeliveryInfoDto;
}
