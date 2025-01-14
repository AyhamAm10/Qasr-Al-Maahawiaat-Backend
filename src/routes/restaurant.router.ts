import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { HRController } from "../controllers/hr.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { checkRole } from "../middleware/checkRole.middleware";
import { UserRole } from "../entity/Users";

const restaurantRouter:Router = Router();


restaurantRouter.post("/", 
    authMiddleware,
    checkRole([UserRole.HR , UserRole.superAdmin]),
    HRController.addRestaurantTool
 );

 restaurantRouter.post("/assign", 
    authMiddleware,
    checkRole([UserRole.HR , UserRole.superAdmin]),
    HRController.assignRestaurantToolToUser
 );

export default restaurantRouter;