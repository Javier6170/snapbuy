/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { TransactionsService } from '../../../src/transactions/transactions.service';
import { Transaction } from '../../../src/transactions/entities/transaction.entity';
import { InternalCreateTransactionDto } from '../../../src/transactions/dto/internal-create-transaction.dto';
import { UpdateTransactionDto } from '../../../src/transactions/dto/update-transaction.dto';

type MockRepo<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repo: MockRepo<Transaction>;

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      findOneBy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: getRepositoryToken(Transaction), useValue: repo },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  describe('create', () => {
    it('should create and save a transaction with PENDING status', async () => {
      const dto: InternalCreateTransactionDto = {
        customerId: 'uuid-customer',
        amountInCents: 5000,
        status: 'PENDING',
        reference: 'ref-123',
      };

      const createdTx = { id: 'uuid-tx', ...dto, status: 'PENDING' };
      repo.create!.mockReturnValue(createdTx);
      repo.save!.mockResolvedValue(createdTx);

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith({ ...dto, status: 'PENDING' });
      expect(repo.save).toHaveBeenCalledWith(createdTx);
      expect(result).toEqual(createdTx);
    });
  });

  describe('update', () => {
    it('should update existing transaction', async () => {
      const id = 'uuid-tx';
      const dto: UpdateTransactionDto = { status: 'APPROVED', reference: 'new-ref' };
      const updatedTx = { id, customerId: 'uuid-customer', amountInCents: 5000, status: 'APPROVED', reference: 'new-ref' };

      repo.update!.mockResolvedValue(undefined);
      repo.findOneBy!.mockResolvedValue(updatedTx);

      const result = await service.update(id, dto);

      expect(repo.update).toHaveBeenCalledWith(id, dto);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id });
      expect(result).toEqual(updatedTx);
    });

    it('should throw NotFoundException if transaction not found', async () => {
      const id = 'nonexistent-tx';
      const dto: UpdateTransactionDto = { status: 'FAILED' };

      repo.update!.mockResolvedValue(undefined);
      repo.findOneBy!.mockResolvedValue(null);

      await expect(service.update(id, dto)).rejects.toThrow(NotFoundException);
      expect(repo.update).toHaveBeenCalledWith(id, dto);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id });
    });
  });

  describe('updateStatus', () => {
    it('should update only the status of the transaction', async () => {
      const id = 'uuid-tx';
      const status = 'APPROVED' as const;

      repo.update!.mockResolvedValue(undefined);

      await service.updateStatus(id, status);

      expect(repo.update).toHaveBeenCalledWith(id, { status });
    });
  });
});
