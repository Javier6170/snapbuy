
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Transaction {
  @ApiProperty({
    description: 'Identificador único de la transacción',
    example: '15113-1748017219-17065',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'ID del producto asociado a la transacción',
    example: 'd6edb7f2-9bf5-437f-a0bc-483dc9b40bf3',
  })
  @Column()
  productId: string;

  @ApiProperty({
    description: 'ID del cliente que realiza la transacción',
    example: '2b29d781-b4a4-419c-a2c5-96ddc444dd20',
  })
  @Column()
  customerId: string;

  @ApiProperty({
    description: 'Cantidad de unidades del producto',
    example: 2,
  })
  @Column('int')
  quantity: number;

  @ApiProperty({
    description: 'Estado de la transacción',
    enum: ['PENDING', 'APPROVED', 'FAILED', 'DECLINED', 'VOIDED', 'ERROR'],
    example: 'PENDING',
  })
  @Column()
  status: string;

  @ApiProperty({
    description: 'Monto cobrado en centavos',
    example: 258000,
  })
  @Column('int')
  amountInCents: number;

  @ApiProperty({
    description: 'Referencia única generada para la transacción',
    example: 'ref-1748017213426',
    required: false,
  })
  @Column({ nullable: true })
  reference: string;

  @ApiProperty({
    description: 'Fecha de creación de la transacción',
    example: '2025-05-23T16:20:20.819Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización de la transacción',
    example: '2025-05-23T16:22:45.123Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
