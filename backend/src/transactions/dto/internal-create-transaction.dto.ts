import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

import { CreateGeneralTransactionDto } from './create-general-transaction.dto';


export class InternalCreateTransactionDto extends CreateGeneralTransactionDto {
  @ApiProperty({
    description: 'Estado inicial de la transacción',
    enum: ['PENDING', 'APPROVED', 'FAILED'],
    example: 'PENDING',
  })
  @IsString()
  @IsIn(['PENDING', 'APPROVED', 'FAILED'])
  status: 'PENDING' | 'APPROVED' | 'FAILED';

  @ApiProperty({
    description: 'Referencia única de la transacción',
    example: 'ref-1748017213426',
    required: false,
  })
  @IsOptional()
  @IsString()
  reference?: string;
}