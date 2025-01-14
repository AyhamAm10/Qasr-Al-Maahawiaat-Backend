import * as dotenv from "dotenv";
import * as fs from "fs";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/Users";
import { Category } from "../entity/Categories";
import { Order } from "../entity/Order";
import { OrderProduct } from "../entity/OrderProducts";
import { ProductData } from "../entity/ProductData";
import { Product } from "../entity/Products";
import { Recommended } from "../entity/Recommended";
import { Variation } from "../entity/Variation";
import { UserRestaurantTool } from "../entity/UserRestaurantTool";
import { RestaurantTool } from "../entity/RestaurantTool";
import { Translation } from "../entity/Translation";

dotenv.config();
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, NODE_ENV } =
  process.env;


export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: Number(DB_PORT || "5432"),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: false,
  logging: false,
  ssl: false,
  entities: [
    User,
    Category,
    Order,
    OrderProduct,
    ProductData,
    Product,
    Recommended,
    Variation,
    UserRestaurantTool,
    RestaurantTool,
    Translation
  ],

  migrations: [__dirname + "/../migrations/*.ts"],
  subscribers: [],
});
