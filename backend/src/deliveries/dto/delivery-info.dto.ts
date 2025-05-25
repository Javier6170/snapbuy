// src/payments/dto/delivery-info.dto.ts
import { IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeliveryInfoDto {
  @ApiProperty({ description: 'Línea 1 de la dirección', example: 'Cra. 15 #123-45' })
  @IsString()
  @Length(5, 100)
  addressLine1: string;

  @ApiProperty({ description: 'Línea 2 de la dirección', example: 'Apto 302' , required: false})
  @IsOptional()
  @IsString()
  @Length(0, 100)
  addressLine2?: string;

  @ApiProperty({ description: 'Ciudad', example: 'Armenia' })
  @IsString()
  @Length(2, 50)
  city: string;

  @ApiProperty({ description: 'Departamento / Estado', example: 'Quindío' })
  @IsString()
  @Length(2, 50)
  state: string;

  @ApiProperty({ description: 'Código postal', example: '630001' })
  @IsString()
  @Length(4, 20)
  postalCode: string;

  @ApiProperty({ description: 'País', example: 'Colombia' })
  @IsString()
  @Length(2, 50)
  country: string;

  @ApiProperty({ description: 'Teléfono de contacto', example: '+57 3001234567', required: false})
  @IsOptional()
  @IsString()
  @Length(7, 20)
  phone?: string;
}
