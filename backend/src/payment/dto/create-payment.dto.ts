import { 
  IsUUID, 
  IsEmail, 
  IsInt, 
  Min, 
  IsString 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'ID del cliente que realiza el pago',
    format: 'uuid',
    example: '2b29d781-b4a4-419c-a2c5-96ddc444dd20',
  })
  @IsUUID()
  customerId: string;

  @ApiProperty({
    description: 'ID del producto que se va a comprar',
    format: 'uuid',
    example: 'd6edb7f2-9bf5-437f-a0bc-483dc9b40bf3',
  })
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'Correo electrónico del cliente',
    format: 'email',
    example: 'cliente@ejemplo.com',
  })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({
    description: 'Cantidad de unidades pedidas',
    type: 'integer',
    minimum: 1,
    example: 2,
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Monto total en centavos (COP)',
    type: 'integer',
    minimum: 100,
    example: 258000,
  })
  @IsInt()
  @Min(100)
  amountInCents: number;

  @ApiProperty({
    description: 'Número de la tarjeta (16 dígitos)',
    example: '4242424242424242',
  })
  @IsString()
  cardNumber: string;

  @ApiProperty({
    description: 'Código de seguridad CVC (3 dígitos)',
    example: '123',
  })
  @IsString()
  cvc: string;

  @ApiProperty({
    description: 'Mes de expiración de la tarjeta (MM)',
    example: '08',
  })
  @IsString()
  expMonth: string;

  @ApiProperty({
    description: 'Año de expiración de la tarjeta (YY)',
    example: '28',
  })
  @IsString()
  expYear: string;

  @ApiProperty({
    description: 'Nombre que aparece en la tarjeta',
    example: 'Juan Pérez',
  })
  @IsString()
  name: string;
}
