import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { ProductData } from "./ProductData";
import { Translation } from "./Translation";

@Entity("variations")
export class Variation {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Translation, (translation) => translation.variation)
  translations: Translation[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @OneToMany(() => ProductData, (ProductData) => ProductData.variation, {
    cascade: true,
  })
  productdata: ProductData[];
}
