import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Order } from "../entity/Order";
import { OrderProduct } from "../entity/OrderProducts";
import { AppDataSource } from "../config/data_source";
import { APIError, HttpStatusCode } from "../error/api.error";
import { validator } from "../helper/validation/validator";
import { orderValidatorSchema } from "../helper/validation/validationSchemas";

const orderRepository = AppDataSource.getRepository(Order);
const OrderProductRepository = AppDataSource.getRepository(OrderProduct);
export class OrderController {
  static async add(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        delivery_fee,
        valet,
        subtotal,
        total,
        order_type,
        table_number,
        lat,
        long,
        phone_number,
        take_away_time,
        street_address,
        building_name,
        apartment_number,
        products,
      } = req.body;

      await validator(orderValidatorSchema , req.body)
      
      if (!products || products.length === 0) {
        throw new APIError(HttpStatusCode.BAD_REQUEST, "Products are required");
      }

      const newOrder = orderRepository.create({
        delivery_fee,
        valet,
        subtotal,
        total,
        order_type,
        table_number,
        lat,
        long,
        phone_number,
        take_away_time,
        street_address,
        building_name,
        apartment_number,
      });

      const savedOrder = await orderRepository.save(newOrder);

      const orderDetails = products.map((item: OrderProduct) =>
        OrderProductRepository.create({
          product: item.product,
          order: savedOrder,
          variation: item.variation,
          product_count: item.product_count,
          product_price: item.product_price,
        })
      );

      await OrderProductRepository.save(orderDetails);

      res.status(HttpStatusCode.OK_CREATED).json({
        message: "Order created successfully",
        orderId: savedOrder.id,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 10 } = req.query;

      const [orders, total] = await orderRepository.findAndCount({
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        relations: ["orderProduct", "orderProduct.product"],
        order: { createdAt: "DESC" },
      });

      res.status(HttpStatusCode.OK).json({
        data: orders,
        metaData: {
          total,
          page: Number(page),
          limit: Number(limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const order = await orderRepository.findOne({
        where: { id: Number(id) },
        relations: ["orderProduct", "orderProduct.product"], 
      });

      if (!order) {
        throw new APIError(HttpStatusCode.NOT_FOUND , "Order not found")
      }
      res.status(HttpStatusCode.OK).json(order);
    } catch (error) {
      next(error);
    }
  }

  static async updateOrder(req: Request, res: Response, next: NextFunction) : Promise<void>{
    try {
      const { id } = req.params;
      const updateData = req.body;

      const order = await orderRepository.findOneBy({ id: Number(id) });

      if (!order) {
        throw new  APIError(HttpStatusCode.NOT_FOUND , "order not found")
      }

      await orderRepository.update(id, updateData);

      res
        .status(HttpStatusCode.OK)
        .json({ message: "Order updated successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async deleteOrder(req: Request, res: Response, next: NextFunction) : Promise<void>{
    try {
      const { id } = req.params;

      const order = await orderRepository.findOneBy({ id: Number(id) });

      if (!order) {
        throw new APIError(HttpStatusCode.NOT_FOUND , "Order not found")
      }

      await orderRepository.remove(order);

      res
        .status(HttpStatusCode.OK)
        .json({ message: "Order deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
