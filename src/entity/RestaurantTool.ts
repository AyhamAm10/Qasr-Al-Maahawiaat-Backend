import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from "typeorm";
import { User } from "./Users";
import { UserRestaurantTool } from "./UserRestaurantTool";

@Entity()
export class RestaurantTool {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "int", default: 0 })
  quantity: number;

  @Column({ type: "int", default: 0 })
  available: number;

  @OneToMany(() => UserRestaurantTool, (userTool) => userTool.restaurantTool)
  userRestaurantTools: UserRestaurantTool[];
}
