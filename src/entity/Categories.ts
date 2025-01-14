import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Product } from './Products';
import { Translation } from './Translation';

@Entity('Categories') 
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image_url: string;

  @CreateDateColumn({ name: 'created_at' }) 
  createdAt: Date;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[]; 

  @OneToMany(() => Translation, (translation) => translation.category)
  translations: Translation[];

}
