import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Product } from './Products';

@Entity('Recommended') 
export class Recommended {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Product, (product) => product.recommended, { nullable: true })
  @JoinColumn() 
  product: Product; 

}
