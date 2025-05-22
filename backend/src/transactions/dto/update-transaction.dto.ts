import { IsString, IsOptional } from 'class-validator';
export class UpdateTransactionDto {
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() reference?: string;
}
