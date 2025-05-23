import { ApiProperty } from '@nestjs/swagger';
import { CreateTransactionDto } from './create-transaction.dto';

export class InternalCreateTransactionDto extends CreateTransactionDto {
  @ApiProperty({
    description: 'Estado inicial de la transacción',
    enum: ['PENDING', 'APPROVED', 'FAILED'],
    example: 'PENDING',
  })
  status: 'PENDING' | 'APPROVED' | 'FAILED';

  @ApiProperty({
    description: 'Referencia única de la transacción',
    example: 'ref-1748017213426',
    required: false,
  })
  reference?: string;
}