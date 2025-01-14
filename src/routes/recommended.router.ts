import { Router } from "express";
import { RecommendedController } from "../controllers/recommended.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { checkRole } from "../middleware/checkRole.middleware";
import { UserRole } from "../entity/Users";

const recommendedRouter:Router = Router();

recommendedRouter.post("/", 
    authMiddleware,
    checkRole([UserRole.HR, UserRole.dataEntry, UserRole.superAdmin]),
    RecommendedController.addRecommended 
);

recommendedRouter.get("/", 
    RecommendedController.getRecommendedProducts 
);

recommendedRouter.get("/count",
    authMiddleware,
    checkRole([UserRole.HR, UserRole.dataEntry, UserRole.superAdmin]),
    RecommendedController.getRecommendedProductNumber 
);

recommendedRouter.delete("/:id",
    authMiddleware,
    checkRole([UserRole.HR, UserRole.dataEntry, UserRole.superAdmin]),
    RecommendedController.getRecommendedProductNumber 
);

recommendedRouter.get("/:id", 
    RecommendedController.getRecommendedProductById 
);



export default recommendedRouter;
