import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty({
    description: 'Cantidad nueva de stock para el producto',
    example: 5,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  quantity: number;
}
