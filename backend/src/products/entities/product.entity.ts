import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column('text') description: string;
   @Column('decimal', { precision: 10, scale: 2 })
  price: number;
  @Column('int') stock: number;
  @Column({ type: 'varchar', length: 255, nullable: true })
  imageUrl?: string;
}