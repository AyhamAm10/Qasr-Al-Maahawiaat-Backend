import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/data_source";
import { User } from "../entity/Users";
import { APIError, HttpStatusCode } from "../error/api.error";

interface AuthenticatedRequest extends Request {
  currentUser?: User;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(new APIError(HttpStatusCode.UNAUTHORIZED, "Authorization header is missing"));
    }

    const accessToken = authHeader.split(" ")[1];

    if (!accessToken) {
      return next(new APIError(HttpStatusCode.UNAUTHORIZED, "Access token is missing"));
    }

    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string,
      async (err, decoded: any) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            const refreshToken = req.cookies?.jwt;
            if (!refreshToken) {
              return next(new APIError(HttpStatusCode.FORBIDDEN, "Refresh token is missing"));
            }

            try {
              const refreshDecoded = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET as string
              ) as { userId: number };

              const newAccessToken = jwt.sign(
                { userId: refreshDecoded.userId },
                process.env.ACCESS_TOKEN_SECRET as string,
                { expiresIn: "1h" }
              );

              res.setHeader("Authorization", `Bearer ${newAccessToken}`);
              req.headers.authorization = `Bearer ${newAccessToken}`;
              decoded = { userId: refreshDecoded.userId };
            } catch {
              return next(new APIError(HttpStatusCode.FORBIDDEN, "Invalid refresh token"));
            }
          } else {
            return next(new APIError(HttpStatusCode.FORBIDDEN, "Invalid access token"));
          }
        }

        const userId = decoded?.userId;
        if (!userId) {
          return next(new APIError(HttpStatusCode.UNAUTHORIZED, "Invalid token payload"));
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: userId } });

        if (!user) {
          return next(new APIError(HttpStatusCode.NOT_FOUND, "User not found"));
        }

        req.currentUser = user;

        return next(); 
      }
    );
  } catch (error) {
    return next(error);
  }
};
