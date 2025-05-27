// src/deliveries/deliveries.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Delivery } from './entities/delivery.entity';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { DeliveryDto } from './dto/delivery.dto';

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectRepository(Delivery)
    private readonly repo: Repository<Delivery>,
  ) {}

  async create(dto: CreateDeliveryDto): Promise<Delivery> {
    const delivery = this.repo.create(dto);
    return this.repo.save(delivery);
  }

  async findOne(id: string): Promise<Delivery> {
    const delivery = await this.repo.findOneBy({ id });
    if (!delivery) {
      throw new NotFoundException(`Delivery con id ${id} no encontrado`);
    }
    return delivery;
  }

  async update(id: string, dto: UpdateDeliveryDto): Promise<Delivery> {
    const delivery = await this.findOne(id);

    // Asigna sólo los campos presentes en dto
    Object.assign(delivery, dto);

    return this.repo.save(delivery);
  }

  // Opcional: convertir entidad a DTO de salida
  toDto(entity: Delivery): DeliveryDto {
    const { id, transactionId, customerId, productId, quantity, createdAt } = entity;
    return { id, transactionId, customerId, productId, quantity, createdAt };
  }
}
