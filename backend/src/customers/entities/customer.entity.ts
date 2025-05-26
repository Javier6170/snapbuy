import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column() address: string;
  @Column() email: string;
  @Column() documentNumber: string;
  @Column() documentType: string;
}