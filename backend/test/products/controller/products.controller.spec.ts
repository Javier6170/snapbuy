import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { UpdateProductDto } from '../../../src/products/dto/update-product.dto';
import { ProductsController } from '../../../src/products/products.controller';
import { ProductsService } from '../../../src/products/products.service';


describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  const mockProducts = [
    {
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Prod A',
      description: 'Desc A',
      price: 100,
      stock: 5,
      imageUrl: null,
    },
    {
      id: '22222222-2222-4222-8222-222222222222',
      name: 'Prod B',
      description: 'Desc B',
      price: 200,
      stock: 3,
      imageUrl: 'http://img',
    },
  ];
  const mockService = {
    findAll: jest.fn().mockResolvedValue(mockProducts),
    updateStock: jest
      .fn()
      .mockImplementation((id: string, qty: number) =>
        Promise.resolve({ id, stock: qty }),
      ),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: mockService }],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // Limpia todos los contadores de llamadas tras cada test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /products → 200 and returns list', () => {
    return request(app.getHttpServer())
      .get('/products')
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(mockService.findAll).toHaveBeenCalledTimes(1);
        expect(body).toEqual(mockProducts);
      });
  });

  it('PATCH /products/:id/stock → 200 and updates stock', () => {
    const dto: UpdateProductDto = { quantity: 7 };
    const productId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

    return request(app.getHttpServer())
      .patch(`/products/${productId}/stock`)
      .send(dto)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(mockService.updateStock).toHaveBeenCalledWith(
          productId,
          dto.quantity,
        );
        expect(body).toEqual({ id: productId, stock: dto.quantity });
      });
  });

  it('PATCH /products/:id/stock → 400 on invalid payload', () => {
    const invalidDto = { quantity: -5 };
    const productId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

    return request(app.getHttpServer())
      .patch(`/products/${productId}/stock`)
      .send(invalidDto)
      .expect(HttpStatus.BAD_REQUEST)
      .then(({ body }) => {
        expect(body.message).toContain('quantity must not be less than 0');
        expect(mockService.updateStock).not.toHaveBeenCalled();
      });
  });
});