import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delivery } from './entities/delivery.entity';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectRepository(Delivery)
    private readonly repo: Repository<Delivery>,
  ) {}

  create(dto: CreateDeliveryDto) {
    const del = this.repo.create(dto);
    return this.repo.save(del);
  }

  async findOne(id: string) {
    const del = await this.repo.findOneBy({ id });
    if (!del) throw new NotFoundException('Delivery not found');
    return del;
  }

  async update(id: string, dto: UpdateDeliveryDto) {
    await this.repo.update(id, dto);
    const updated = await this.repo.findOneBy({ id });
    if (!updated) throw new NotFoundException('Delivery not found');
    return updated;
  }
}