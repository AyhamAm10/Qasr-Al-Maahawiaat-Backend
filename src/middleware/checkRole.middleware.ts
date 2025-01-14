import { Request, Response, NextFunction } from "express";
import { UserRole } from "../entity/Users";

export const checkRole = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const user = req.currentUser;

      if (!user) {
        return next({
          status: 401,
          message: "Unauthorized: No user found",
        });
      }
      if (!roles.includes(user.role)) {
        return next({
          status: 403,
          message: "Forbidden: Insufficient role",
        });
      }
      next();
    } catch (error) {
      next(error); 
    }
  };
};
