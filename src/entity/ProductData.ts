import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Variation } from "./Variation";
import { Product } from "./Products";

@Entity("ProductData")
export class ProductData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  image: string;

  @Column({ type: 'double precision' })
  price_For_variation: number;

  @Column({ type: 'double precision', nullable: true })
  offer_for_variation: number;

  @ManyToOne(() => Product, (product) => product.productsData, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product: Product;

  @ManyToOne(() => Variation, (variation) => variation.productdata, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "variation_id" })
  variation: Variation;
}
