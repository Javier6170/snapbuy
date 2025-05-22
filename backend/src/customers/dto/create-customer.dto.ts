import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
export class CreateCustomerDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsNotEmpty() address: string;
  @IsEmail() email: string;
}