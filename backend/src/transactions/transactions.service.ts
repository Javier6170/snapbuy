import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Transaction } from './entities/transaction.entity';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InternalCreateTransactionDto } from './dto/internal-create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly repo: Repository<Transaction>,
  ) {}

  create(dto: InternalCreateTransactionDto) {
    const tx = this.repo.create({ ...dto, status: 'PENDING' });
    return this.repo.save(tx);
  }

  async update(id: string, dto: UpdateTransactionDto) {
    await this.repo.update(id, dto);
    const updated = await this.repo.findOneBy({ id });
    if (!updated) throw new NotFoundException('Transaction not found');
    return updated;
  }

  async updateStatus(id: string, status: 'PENDING' | 'APPROVED' | 'FAILED') {
  await this.repo.update(id, { status });
}
}