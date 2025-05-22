import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly svc: ProductsService) {}

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Patch(':id/stock')
  updateStock(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.svc.updateStock(id, dto.quantity);
  }
}