import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
@Entity()
export class Delivery {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() transactionId: string;
  @Column() customerId: string;
  @Column() productId: string;
  @Column('int') quantity: number;
  @CreateDateColumn() createdAt: Date;
}
