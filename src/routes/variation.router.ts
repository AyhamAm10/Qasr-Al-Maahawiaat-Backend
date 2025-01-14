import { Router } from "express";
import { VariationController } from "../controllers/variations.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { checkRole } from "../middleware/checkRole.middleware";
import { UserRole } from "../entity/Users";

const variationRouter:Router = Router();

variationRouter.post("/",
    authMiddleware,
    checkRole([UserRole.HR ,UserRole.dataEntry, UserRole.superAdmin ]),
    VariationController.addVariation 
);

variationRouter.get("/",
    VariationController.getVariations 
);

variationRouter.get("/:id",
    VariationController.getVariationById 
);

variationRouter.put("/:id",
    authMiddleware,
    checkRole([UserRole.HR ,UserRole.dataEntry, UserRole.superAdmin ]),
    VariationController.updateVariation 
);

variationRouter.delete("/:id",
    authMiddleware,
    checkRole([UserRole.HR ,UserRole.dataEntry, UserRole.superAdmin ]),
    VariationController.removeVariation 
);

export default variationRouter;
