import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Delivery {
  @ApiProperty({ description: 'UUID de la entrega' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'ID de la transacción asociada' })
  @Column()
  transactionId: string;

  @ApiProperty({ description: 'UUID del cliente que recibe la entrega' })
  @Column()
  customerId: string;

  @ApiProperty({ description: 'UUID del producto a entregar' })
  @Column()
  productId: string;

  @ApiProperty({ description: 'Cantidad de unidades a entregar', example: 1 })
  @Column('int')
  quantity: number;

  @ApiProperty({ description: 'Fecha de creación de la entrega', type: String, format: 'date-time' })
  @CreateDateColumn()
  createdAt: Date;
}
