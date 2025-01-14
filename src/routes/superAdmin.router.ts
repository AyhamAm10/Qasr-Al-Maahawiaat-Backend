import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { checkRole } from "../middleware/checkRole.middleware";
import { UserRole } from "../entity/Users";
import { UserController } from "../controllers/superAdmin.controller";
import { HRController } from "../controllers/hr.controller";

const adminRoutes: Router = Router();

adminRoutes.get(
  "/",
  authMiddleware,
  checkRole([UserRole.HR, UserRole.dataEntry, UserRole.superAdmin]),
  UserController.getUsers
);

adminRoutes.post(
  "/",
  authMiddleware,
  checkRole([UserRole.superAdmin]),
  UserController.addUser
);

adminRoutes.get(
  "/:id",
  authMiddleware,
  checkRole([UserRole.HR, UserRole.dataEntry, UserRole.superAdmin]),
  UserController.getUserById
);

adminRoutes.delete(
  "/:id",
  authMiddleware,
  checkRole([UserRole.superAdmin]),
  UserController.deleteUser
);

adminRoutes.post("/penaltiesAndDiscounts", 
    authMiddleware,
    checkRole([UserRole.HR , UserRole.superAdmin]),
    HRController.addPenaltiesAndDiscounts
 );

 adminRoutes.post("/loans", 
    authMiddleware,
    checkRole([UserRole.HR , UserRole.superAdmin]),
    HRController.addPenaltiesAndDiscounts
 );

 adminRoutes.post("/salary", 
    authMiddleware,
    checkRole([UserRole.HR , UserRole.superAdmin]),
    HRController.addPenaltiesAndDiscounts
 );

 adminRoutes.post("/vacation-days", 
    authMiddleware,
    checkRole([UserRole.HR , UserRole.superAdmin]),
    HRController.addPenaltiesAndDiscounts
 );

 adminRoutes.post("/weekly-holidays", 
    authMiddleware,
    checkRole([UserRole.HR , UserRole.superAdmin]),
    HRController.addPenaltiesAndDiscounts
 );

 adminRoutes.post("/sick-days", 
    authMiddleware,
    checkRole([UserRole.HR , UserRole.superAdmin]),
    HRController.addPenaltiesAndDiscounts
 );

 adminRoutes.post("/loans", 
    authMiddleware,
    checkRole([UserRole.HR , UserRole.superAdmin]),
    HRController.addPenaltiesAndDiscounts
 );

 adminRoutes.post("/loans", 
    authMiddleware,
    checkRole([UserRole.HR , UserRole.superAdmin]),
    HRController.addPenaltiesAndDiscounts
 );

export default adminRoutes;
