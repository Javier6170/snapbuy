import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('products')                    
@Controller('products')
export class ProductsController {
  constructor(private readonly svc: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los productos' })
  @ApiResponse({ status: 200, description: 'Productos obtenidos correctamente.' })
  findAll() {
    return this.svc.findAll();
  }

  @Patch(':id/stock')
  @ApiOperation({ summary: 'Actualizar stock de un producto' })
  @ApiParam({ name: 'id', description: 'UUID del producto' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Stock actualizado correctamente.' })
  updateStock(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.svc.updateStock(id, dto.quantity);
  }
}
