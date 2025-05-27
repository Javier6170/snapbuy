/* eslint-disable @typescript-eslint/no-explicit-any */
// test/deliveries/deliveries.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Delivery, DeliveryStatus } from '../../../src/deliveries/entities/delivery.entity';
import { CreateDeliveryDto } from '../../../src/deliveries/dto/create-delivery.dto';
import { UpdateDeliveryDto } from '../../../src/deliveries/dto/update-delivery.dto';
import { DeliveryDto } from '../../../src/deliveries/dto/delivery.dto';
import { DeliveriesService } from '../../../src/deliveries/deliveries.service';


describe('DeliveriesService', () => {
  let service: DeliveriesService;
  let repo: jest.Mocked<Repository<Delivery>>;

  beforeEach(async () => {
    const mockRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOneBy: jest.fn(),
    } as unknown as jest.Mocked<Repository<Delivery>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveriesService,
        { provide: getRepositoryToken(Delivery), useValue: mockRepo },
      ],
    }).compile();

    service = module.get(DeliveriesService);
    repo = module.get(getRepositoryToken(Delivery));
  });

  describe('create', () => {
    it('should create and save a delivery', async () => {
      const dto: CreateDeliveryDto = {
        transactionId: 'tx-1',
        customerId: 'cust-1',
        productId: 'prod-1',
        quantity: 3,
        deliveryInfo: { addressLine1: 'Ave 1' },
      } as any;
      const entity = {
        id: 'del-1',
        ...dto,
        status: DeliveryStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Delivery;

      repo.create.mockReturnValue(entity);
      repo.save.mockResolvedValue(entity);

      await expect(service.create(dto)).resolves.toEqual(entity);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(entity);
    });
  });

  describe('findOne', () => {
    it('should return delivery if found', async () => {
      const entity = {
        id: 'del-2',
        transactionId: 'tx-2',
        customerId: 'cust-2',
        productId: 'prod-2',
        quantity: 1,
        status: DeliveryStatus.SHIPPED,
        deliveryInfo: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Delivery;

      repo.findOneBy.mockResolvedValue(entity);

      await expect(service.findOne('del-2')).resolves.toEqual(entity);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 'del-2' });
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('nope')).rejects.toThrow(NotFoundException);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 'nope' });
    });
  });

  describe('update', () => {
    it('should merge dto into entity and save', async () => {
      const original = {
        id: 'del-3',
        transactionId: 'tx-3',
        customerId: 'cust-3',
        productId: 'prod-3',
        quantity: 2,
        status: DeliveryStatus.PENDING,
        deliveryInfo: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Delivery;
      const dto: UpdateDeliveryDto = { quantity: 5 };

      repo.findOneBy.mockResolvedValue(original);
      const updated = { ...original, ...dto, updatedAt: new Date() } as Delivery;
      repo.save.mockResolvedValue(updated);

      await expect(service.update('del-3', dto)).resolves.toEqual(updated);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 'del-3' });
      expect(repo.save).toHaveBeenCalledWith(updated);
    });
  });

  describe('toDto', () => {
    it('should map entity to DeliveryDto', () => {
      const now = new Date();
      const entity: Delivery = {
        id: 'del-4',
        transactionId: 'tx-4',
        customerId: 'cust-4',
        productId: 'prod-4',
        quantity: 4,
        status: DeliveryStatus.DELIVERED,
        deliveryInfo: undefined,
        createdAt: now,
        updatedAt: now,
      } as any;

      const dto: DeliveryDto = service.toDto(entity);
      expect(dto).toEqual({
        id: 'del-4',
        transactionId: 'tx-4',
        customerId: 'cust-4',
        productId: 'prod-4',
        quantity: 4,
        createdAt: now,
      });
    });
  });
});