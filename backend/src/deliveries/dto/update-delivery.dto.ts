import { IsUUID, IsInt, Min, IsOptional } from 'class-validator';
export class UpdateDeliveryDto {
  @IsOptional() @IsUUID() transactionId?: string;
  @IsOptional() @IsUUID() customerId?: string;
  @IsOptional() @IsUUID() productId?: string;
  @IsOptional() @IsInt() @Min(1) quantity?: number;
}