import { IsUUID, IsEmail, IsInt, Min, IsString, Matches } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  customerId: string;

  @IsUUID()
  productId: string;

  @IsEmail()
  customerEmail: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsInt()
  @Min(100)
  amountInCents: number;

  @IsString()
  cardNumber: string;

  @IsString()
  cvc: string;

  @IsString()
  expMonth: string;

  @IsString()
  expYear: string;

  @IsString()
  name: string;
}