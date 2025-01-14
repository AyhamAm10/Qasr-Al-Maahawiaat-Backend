import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
  } from 'typeorm';
import { OrderProduct } from './OrderProducts';
  
  export enum OrderType {
    DELIVERY = 'delivery',
    TAKEAWAY = 'takeaway',
    DINE_IN = 'dine_in',
  }
  
  @Entity('orders') 
  export class Order {
    @PrimaryGeneratedColumn()
    id: number;
  
    @CreateDateColumn({ name: 'created_at' }) 
    createdAt: Date;
  
    @Column({ type: 'double precision' })
    delivery_fee: number;
  
    @Column({ type: 'double precision' })
    valet: number;
  
    @Column({ type: 'double precision' })
    subtotal: number;
  
    @Column({ type: 'double precision' })
    total: number;
  
    @Column({
      type: 'enum',
      enum: OrderType,
      default: OrderType.DELIVERY,
    })
    order_type: OrderType;
  
    @Column({ type: 'int', nullable: true })
    table_number: number;
  
    @Column({ type: 'double precision', nullable: true })
    lat: number;
  
    @Column({ type: 'double precision', nullable: true })
    long: number;
  
    @Column({ type: 'varchar', length: 15, nullable: true })
    phone_number: string;
  
    @Column({ type: 'time', nullable: true })
    take_away_time: string;
  
    @Column({ type: 'varchar', length: 255, nullable: true })
    street_address: string;
  
    @Column({ type: 'varchar', length: 255, nullable: true })
    building_name: string;
  
    @Column({ type: 'varchar', length: 50, nullable: true })
    apartment_number: string;

    @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
    orderProducts: OrderProduct[];

  }
  