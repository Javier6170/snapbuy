/* eslint-disable @typescript-eslint/no-explicit-any */
// src/customers/customers.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';

import { CustomersService } from '../../../src/customers/customers.service';
import { Customer } from '../../../src/customers/entities/customer.entity';
import { UpdateCustomerDto } from '../../../src/customers/dto/update-customer.dto';
import { CreateCustomerDto } from '../../../src/customers/dto/create-customer.dto';



type MockRepo<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('CustomersService', () => {
  let service: CustomersService;
  let repo: jest.Mocked<Repository<Customer>>;

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      save: jest.fn(),
      findOneBy: jest.fn(),
      update: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get(CustomersService);
  });

  describe('create', () => {
    it('should create and save a customer', async () => {
      const dto: CreateCustomerDto = {
        name: 'Alice',
        address: '123 St',
        email: 'a@example.com',
        documentType: 'CC',
        documentNumber: '111',
      };
      const entity = { ...dto } as Customer;
      const saved = { id: '1', ...dto } as Customer;

      repo.create.mockReturnValue(entity);
      repo.save.mockResolvedValue(saved);

      const result = await service.create(dto);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(entity);
      expect(result).toEqual(saved);
    });
  });

  describe('findOne', () => {
    it('should return a customer when found', async () => {
      const cust = { id: '1', name: 'Bob' } as Customer;
      repo.findOneBy.mockResolvedValue(cust);

      const result = await service.findOne('1');
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: '1' });
      expect(result).toEqual(cust);
    });

    it('should return null when not found', async () => {
      repo.findOneBy.mockResolvedValue(null);
      const result = await service.findOne('2');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    const updateDto: UpdateCustomerDto = { address: '456 Elm' };

    it('should update and return the updated customer', async () => {
      const updated = { id: '1', name: 'Carol', ...updateDto } as Customer;
      repo.update.mockResolvedValue({ affected: 1 } as any);
      repo.findOneBy.mockResolvedValue(updated);

      const result = await service.update('1', updateDto);
      expect(repo.update).toHaveBeenCalledWith('1', updateDto);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: '1' });
      expect(result).toEqual(updated);
    });

    it('should throw NotFoundException if customer does not exist after update', async () => {
      repo.update.mockResolvedValue({ affected: 0 } as any);
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.update('99', updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(repo.update).toHaveBeenCalledWith('99', updateDto);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: '99' });
    });
  });
});