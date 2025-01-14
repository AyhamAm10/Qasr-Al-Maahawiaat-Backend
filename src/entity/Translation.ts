import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Product } from "./Products";
import { Category } from "./Categories";
import { Variation } from "./Variation";

@Entity("translations")
export class Translation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 50 })
  @Index()
  entity: string;

  @Column({ type: "int" })
  entityId: number;

  @Column({ type: "varchar", length: 10 })
  @Index()
  language: string;

  @Column({ type: "varchar", length: 50 })
  @Index()
  key: string;

  @Column({ type: "text" })
  value: string;

  @ManyToOne(() => Product, (product) => product.translations, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product: Product;

  @ManyToOne(() => Category, (category) => category.translations, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "category_id" })
  category: Category;

  @ManyToOne(() => Variation, (variation) => variation.translations, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "variation_id" })
  variation: Category;
}
