import { IsUUID, IsInt, Min } from 'class-validator';
export class CreateDeliveryDto {
  @IsUUID() transactionId: string;
  @IsUUID() customerId: string;
  @IsUUID() productId: string;
  @IsInt() @Min(1) quantity: number;
}
