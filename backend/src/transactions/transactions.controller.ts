import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { InternalCreateTransactionDto } from './dto/internal-create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly svc: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Crea una nueva transacción (interna)' })
  @ApiBody({ type: InternalCreateTransactionDto })
  @ApiResponse({ status: 201, description: 'Transacción creada', type: Transaction })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() dto: InternalCreateTransactionDto) {
    return this.svc.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza el estado de una transacción existente' })
  @ApiParam({ name: 'id', description: 'ID de la transacción', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiBody({ type: UpdateTransactionDto })
  @ApiResponse({ status: 200, description: 'Transacción actualizada', type: Transaction })
  @ApiResponse({ status: 404, description: 'Transacción no encontrada' })
  update(@Param('id') id: string, @Body() dto: UpdateTransactionDto) {
    return this.svc.update(id, dto);
  }
}
