import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { Product } from './Products'; 
import { Order } from './Order';
import { Variation } from './Variation';

@Entity('order_products')
export class OrderProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.orderProducts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Order, (order) => order.orderProducts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Variation, (variation) => variation.id, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'variation_id' })
  variation: Variation;

  @Column({ type: 'int' })
  product_count: number;

  @Column({ type: 'double precision' })
  product_price: number;
}
