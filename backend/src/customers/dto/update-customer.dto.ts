import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
export class UpdateCustomerDto {
  @IsOptional() @IsString() @IsNotEmpty() name?: string;
  @IsOptional() @IsString() @IsNotEmpty() address?: string;
  @IsOptional() @IsEmail() email?: string;
}