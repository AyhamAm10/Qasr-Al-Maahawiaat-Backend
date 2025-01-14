import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
  const user = (req as any).currentUser;
  res.json({ message: "User profile", user });
});

export default router;
