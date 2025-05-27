import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  async updateStock(id: string, quantity: number) {
    await this.repo.decrement({ id }, 'stock', quantity);
    const updated = await this.repo.findOneBy({ id });
    if (!updated) throw new NotFoundException('Product not found');
    return updated;
  }
}