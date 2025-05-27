/* eslint-disable @typescript-eslint/no-explicit-any */
// test/products/products.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';

import { ProductsService } from '../../../src/products/products.service';
import { Product } from '../../../src/products/entities/product.entity';


type MockRepo<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ProductsService', () => {
  let service: ProductsService;
  let repo: MockRepo<Product>;

  beforeEach(async () => {
    repo = {
      find: jest.fn(),
      decrement: jest.fn(),
      findOneBy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Product), useValue: repo },
      ],
    }).compile();

    service = module.get(ProductsService);
  });

  it('should return all products via findAll', async () => {
    const products: Product[] = [
      { id: 'aaa', name: 'A', description: 'Desc A', price: 10, stock: 5, imageUrl: undefined },
      { id: 'bbb', name: 'B', description: 'Desc B', price: 20, stock: 3, imageUrl: 'url' },
    ];
    repo.find!.mockResolvedValue(products);

    const result = await service.findAll();
    expect(repo.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual(products);
  });

  it('should decrement stock and return updated product', async () => {
    const id = 'ccc';
    const qty = 2;
    const updatedProduct = { id, name: 'C', description: 'Desc C', price: 30, stock: 8, imageUrl: null };
    repo.decrement!.mockResolvedValue(undefined);
    repo.findOneBy!.mockResolvedValue(updatedProduct);

    const result = await service.updateStock(id, qty);

    expect(repo.decrement).toHaveBeenCalledWith({ id }, 'stock', qty);
    expect(repo.findOneBy).toHaveBeenCalledWith({ id });
    expect(result).toEqual(updatedProduct);
  });

  it('should throw NotFoundException if product not found after decrement', async () => {
    const id = 'ddd';
    const qty = 1;
    repo.decrement!.mockResolvedValue(undefined);
    repo.findOneBy!.mockResolvedValue(null);

    await expect(service.updateStock(id, qty)).rejects.toThrow(NotFoundException);
    expect(repo.decrement).toHaveBeenCalledWith({ id }, 'stock', qty);
    expect(repo.findOneBy).toHaveBeenCalledWith({ id });
  });
});
