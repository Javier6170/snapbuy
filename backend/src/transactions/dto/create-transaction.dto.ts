import { IsUUID, IsInt, Min } from 'class-validator';
export class CreateTransactionDto {
  @IsUUID() productId: string;
  @IsUUID() customerId: string;
  @IsInt() @Min(1) quantity: number;
  @IsInt() @Min(0) amountInCents: number;
}