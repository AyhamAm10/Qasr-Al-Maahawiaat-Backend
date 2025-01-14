import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import { Category } from "./Categories";
import { Variation } from "./Variation";
import { Recommended } from "./Recommended";
import { ProductData } from "./ProductData";
import { OrderProduct } from "./OrderProducts";
import { Translation } from "./Translation";

@Entity("Products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column({ type: 'varchar', length: 255 })
  // name: string;

  @Column({ type: "varchar", length: 255 })
  image_url: string;

  // @Column({ type: 'text', nullable: true })
  // details: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @Column({ type: "double precision" })
  base_price: number;

  @Column({ type: "double precision", nullable: true })
  offer_price: number;

  @OneToMany(() => Translation, (translation) => translation.product, {
    cascade: true,
  })
  translations: Translation[];

  @OneToOne(() => Recommended, (recommended) => recommended.product)
  recommended: Recommended;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "category_id" })
  category: Category;

  @OneToMany(() => ProductData, (productData) => productData.product, {
    cascade: true,
  })
  productsData: ProductData[];

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product)
  orderProducts: OrderProduct[];
}
