import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { checkRole } from "../middleware/checkRole.middleware";
import { UserRole } from "../entity/Users";
import { OrderController } from "../controllers/order.controller";

const orderRouter: Router = Router();

orderRouter.post(
  "/",
  OrderController.add
);

  orderRouter.get(
    "/",
    authMiddleware,
    checkRole([UserRole.HR, UserRole.dataEntry, UserRole.superAdmin]),
    OrderController.getOrders
  );

  orderRouter.get(
    "/:id",
    authMiddleware,
    checkRole([UserRole.HR, UserRole.dataEntry, UserRole.superAdmin]),
    OrderController.getOrderById
  );
  
  orderRouter.put(
    "/:id",
    authMiddleware,
    checkRole([UserRole.HR, UserRole.dataEntry, UserRole.superAdmin]),
    OrderController.updateOrder
  );

  orderRouter.delete(
    "/:id",
    authMiddleware,
    checkRole([UserRole.HR, UserRole.dataEntry, UserRole.superAdmin]),
    OrderController.deleteOrder
  );

export default orderRouter;
