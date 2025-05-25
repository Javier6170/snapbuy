import { IsUUID, IsInt, Min, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDeliveryDto {
  @ApiPropertyOptional({ description: 'UUID de la transacción (opc.)' })
  @IsOptional() @IsUUID() transactionId?: string;

  @ApiPropertyOptional({ description: 'UUID del cliente (opc.)' })
  @IsOptional() @IsUUID() customerId?: string;

  @ApiPropertyOptional({ description: 'UUID del producto (opc.)' })
  @IsOptional() @IsUUID() productId?: string;

  @ApiPropertyOptional({ description: 'Cantidad a entregar (opc., mínimo 1)' })
  @IsOptional() @IsInt() @Min(1) quantity?: number;
}
