import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { checkRole } from "../middleware/checkRole.middleware";
import { UserRole } from "../entity/Users";
import { upload } from "../helper/multer.configuration";
const productRouter: Router = Router();

productRouter.get("/", ProductController.getProducts);
productRouter.post(
  "/",
  authMiddleware,
  checkRole([UserRole.HR, UserRole.dataEntry, UserRole.superAdmin]),
  upload,
  ProductController.add
);
productRouter.get("/:id", ProductController.getProductById);
productRouter.get("/category/:categoryId", ProductController.getProductsByCategoryId);

productRouter.delete(
    "/:id",
    authMiddleware,
    checkRole([UserRole.HR, UserRole.dataEntry, UserRole.superAdmin]),
    ProductController.delete
  );
  productRouter.put(
    "/:id",
    authMiddleware,
    checkRole([UserRole.HR, UserRole.dataEntry, UserRole.superAdmin]),
    ProductController.update
  );

  productRouter.post(
    "/offer:id",
    authMiddleware,
    checkRole([UserRole.HR, UserRole.dataEntry, UserRole.superAdmin]),
    ProductController.addOffer
  );

  productRouter.delete(
    "/offer:id",
    authMiddleware,
    checkRole([UserRole.HR, UserRole.dataEntry, UserRole.superAdmin]),
    ProductController.deleteOffer
  );
export default productRouter;
