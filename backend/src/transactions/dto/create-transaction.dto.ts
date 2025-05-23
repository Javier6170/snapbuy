import { IsUUID, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'ID del producto que se va a comprar',
    example: 'd6edb7f2-9bf5-437f-a0bc-483dc9b40bf3',
  })
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'ID del cliente que realiza la transacción',
    example: '2b29d781-b4a4-419c-a2c5-96ddc444dd20',
  })
  @IsUUID()
  customerId: string;

  @ApiProperty({
    description: 'Cantidad de unidades del producto a comprar',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Monto a cobrar en centavos (e.g. 1000 = $10.00)',
    example: 258000,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  amountInCents: number;
}
