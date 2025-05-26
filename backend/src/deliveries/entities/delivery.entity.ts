import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DeliveryInfoDto } from '../dto/delivery-info.dto';

export enum DeliveryStatus {
  PENDING   = 'PENDING',
  SHIPPED   = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELED  = 'CANCELED',
}

@Entity({ name: 'deliveries' })
export class Delivery {
  @ApiPropertyOptional({ description: 'UUID de la entrega' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiPropertyOptional({ description: 'UUID de la transacción asociada' })
  @Column()
  transactionId: string;

  @ApiPropertyOptional({ description: 'UUID del cliente que recibe la entrega' })
  @Column()
  customerId: string;

  @ApiPropertyOptional({ description: 'UUID del producto a entregar' })
  @Column()
  productId: string;

  @ApiPropertyOptional({ description: 'Cantidad de unidades a entregar', example: 1 })
  @Column('int')
  quantity: number;

  @ApiPropertyOptional({
    description: 'Estado de la entrega',
    enum: DeliveryStatus,
    default: DeliveryStatus.PENDING,
  })
  @Column({
    type: 'enum',
    enum: DeliveryStatus,
    default: DeliveryStatus.PENDING,
  })
  status: DeliveryStatus;

 @ApiPropertyOptional({
    description: 'Información de envío (dirección, teléfono, etc.)',
    type: DeliveryInfoDto,
    nullable: true,
  })
  @Column({ type: 'simple-json', nullable: true })
  deliveryInfo?: DeliveryInfoDto;

  @ApiPropertyOptional({ description: 'Fecha de creación', type: String, format: 'date-time' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiPropertyOptional({ description: 'Fecha de última actualización', type: String, format: 'date-time' })
  @UpdateDateColumn()
  updatedAt: Date;
}
