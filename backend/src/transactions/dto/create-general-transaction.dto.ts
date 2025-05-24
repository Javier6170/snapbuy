import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsUUID, Min } from "class-validator";

export class CreateGeneralTransactionDto {
  @ApiProperty({ description: 'ID del cliente', example: 'uuid-cliente' })
  @IsUUID()
  customerId: string;

  @ApiProperty({ description: 'Monto total en centavos', example: 258000 })
  @IsInt()
  @Min(0)
  amountInCents: number;
}