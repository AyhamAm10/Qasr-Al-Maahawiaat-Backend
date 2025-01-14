import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const authRouter:Router = Router();

authRouter.post("/login", AuthController.login );
authRouter.post("/logout", AuthController.logout);

export default authRouter;
