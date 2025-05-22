import { IsInt, Min } from 'class-validator';
export class UpdateProductDto {
  @IsInt() @Min(0) quantity: number;
}