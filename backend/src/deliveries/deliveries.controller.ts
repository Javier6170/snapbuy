import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

import { DeliveriesService } from './deliveries.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

@ApiTags('deliveries')
@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly svc: DeliveriesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva entrega' })
  @ApiBody({ type: CreateDeliveryDto })
  @ApiResponse({
    status: 201,
    description: 'Entrega creada exitosamente',
    type: CreateDeliveryDto, // o un DeliveryDto si lo tienes
  })
  create(@Body() dto: CreateDeliveryDto) {
    return this.svc.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una entrega por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la entrega' })
  @ApiResponse({
    status: 200,
    description: 'Entrega encontrada',
    type: CreateDeliveryDto, // ajusta al tipo de respuesta real
  })
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una entrega existente' })
  @ApiParam({ name: 'id', description: 'UUID de la entrega a actualizar' })
  @ApiBody({ type: UpdateDeliveryDto })
  @ApiResponse({
    status: 200,
    description: 'Entrega actualizada exitosamente',
    type: UpdateDeliveryDto, // ajusta al tipo de respuesta real
  })
  update(@Param('id') id: string, @Body() dto: UpdateDeliveryDto) {
    return this.svc.update(id, dto);
  }
}
