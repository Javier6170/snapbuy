/* eslint-disable @typescript-eslint/no-explicit-any */
// src/deliveries/deliveries.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';

import { DeliveriesController } from '../../../src/deliveries/deliveries.controller';
import { DeliveriesService } from '../../../src/deliveries/deliveries.service';
import { CreateDeliveryDto } from '../../../src/deliveries/dto/create-delivery.dto';
import { UpdateDeliveryDto } from '../../../src/deliveries/dto/update-delivery.dto';
import { Delivery } from '../../../src/deliveries/entities/delivery.entity';




describe('DeliveriesController', () => {
  let controller: DeliveriesController;
  let service: jest.Mocked<DeliveriesService>;

  beforeEach(async () => {
    const mockService: Partial<Record<keyof DeliveriesService, jest.Mock>> = {
      create: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveriesController],
      providers: [
        { provide: DeliveriesService, useValue: mockService },
      ],
    }).compile();

    controller = module.get(DeliveriesController);
    service = module.get(DeliveriesService) as jest.Mocked<DeliveriesService>;
  });

  describe('create', () => {
    it('should call service.create and return the created delivery', async () => {
      const dto: CreateDeliveryDto = {
        orderId: 'order-123',
        address: '123 Main St',
        scheduledAt: '2025-06-01T10:00:00Z',
      } as any;

      const now = new Date().toISOString();
      const expected: Delivery = {
        id: 'deliv-1',
        ...dto,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
      } as any;

      service.create.mockResolvedValueOnce(expected);

      await expect(controller.create(dto)).resolves.toEqual(expected);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne and return the delivery', async () => {
      const id = 'deliv-1';
      const now = new Date().toISOString();
      const expected: Delivery = {
        id,
        orderId: 'order-123',
        address: '123 Main St',
        scheduledAt: '2025-06-01T10:00:00Z',
        status: 'shipped',
        createdAt: now,
        updatedAt: now,
      } as any;

      service.findOne.mockResolvedValueOnce(expected);

      await expect(controller.findOne(id)).resolves.toEqual(expected);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should call service.update and return the updated delivery', async () => {
      const id = 'deliv-1';
      // UpdateDeliveryDto only has optional fields: transactionId, customerId, productId, quantity
      const dto: UpdateDeliveryDto = { quantity: 5 };
      const now = new Date().toISOString();
      const expected: Delivery = {
        id,
        orderId: 'order-123',
        address: '123 Main St',
        scheduledAt: '2025-06-01T10:00:00Z',
        quantity: dto.quantity!,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
      } as any;

      service.update.mockResolvedValueOnce(expected);

      await expect(controller.update(id, dto)).resolves.toEqual(expected);
      expect(service.update).toHaveBeenCalledWith(id, dto);
    });
  });
});