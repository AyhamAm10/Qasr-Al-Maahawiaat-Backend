import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { checkRole } from "../middleware/checkRole.middleware";
import { UserRole } from "../entity/Users";
import { upload } from "../helper/multer.configuration";

const categoryRouter: Router = Router();

categoryRouter.post(
  "/",
  authMiddleware,
  checkRole([UserRole.HR, UserRole.dataEntry, UserRole.superAdmin]),
  upload ,
  CategoryController.add
);

categoryRouter.post(
    "/",
    authMiddleware,
    checkRole([UserRole.HR, UserRole.dataEntry, UserRole.superAdmin]),
    upload,
    CategoryController.add
  );

  categoryRouter.get(
    "/",
    CategoryController.getCategories
  );

  categoryRouter.get(
    "/count",
    CategoryController.getCategoryCount
  );

  categoryRouter.get(
    "/:id",
    CategoryController.getCategoryById
  );

  categoryRouter.put(
    "/:id",
    authMiddleware,
    checkRole([UserRole.HR, UserRole.dataEntry, UserRole.superAdmin]),
    upload,
    CategoryController.update
  );

  categoryRouter.delete(
    "/:id",
    authMiddleware,
    checkRole([UserRole.HR, UserRole.dataEntry, UserRole.superAdmin]),
    upload,
    CategoryController.delete
  );

export default categoryRouter;
