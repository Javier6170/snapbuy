import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateTransactionDto {
  @ApiPropertyOptional({
    description: 'Nuevo estado de la transacción',
    enum: ['PENDING', 'APPROVED', 'FAILED'],
    example: 'APPROVED',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Nueva referencia de la transacción',
    example: 'ref-1748017213426',
  })
  @IsOptional()
  @IsString()
  reference?: string;
}