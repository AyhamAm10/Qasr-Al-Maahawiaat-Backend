import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
  } from "typeorm";
  import { User } from "./Users";
  import { RestaurantTool } from "./RestaurantTool";
  
  @Entity()
  export class UserRestaurantTool {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, (user) => user.userRestaurantTools)
    user: User;
  
    @ManyToOne(() => RestaurantTool, (tool) => tool.userRestaurantTools)
    restaurantTool: RestaurantTool;
  
    @Column({ type: "int", default: 0 })
    reservedQuantity: number; 
  }
  