import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() productId: string;
  @Column() customerId: string;
  @Column('int') quantity: number;
  @Column() status: string; // PENDING, APPROVED, FAILED
  @Column('int') amountInCents: number;
  @Column({ nullable: true }) reference: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}