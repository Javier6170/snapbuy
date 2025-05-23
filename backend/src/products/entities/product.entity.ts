import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Product {
  @ApiProperty({
    description: 'Identificador único del producto (UUID)',
    example: '985b9ccb-70f9-4ef9-899b-39b8d6719b75',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Monitor Gamer Samsung C27R500FHL',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Descripción detallada del producto',
    example: 'Pantalla curva 27" Full HD, 60Hz, panel VA...',
  })
  @Column('text')
  description: string;

  @ApiProperty({
    description: 'Precio en pesos colombianos, con dos decimales',
    example: 250000.00,
    type: 'number',
    format: 'double',
  })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({
    description: 'Cantidad disponible en inventario',
    example: 10,
  })
  @Column('int')
  stock: number;

  @ApiProperty({
    description: 'URL de la imagen representativa del producto',
    example: 'https://http2.mlstatic.com/D_NQ_NP_935664-MLA84550501334_052025-O.webp',
    required: false,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  imageUrl?: string;
}
