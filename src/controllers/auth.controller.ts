import { NextFunction, Request, Response } from "express";
import { User } from "../entity/Users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/data_source";
import { APIError, HttpStatusCode } from "../error/api.error";


export class AuthController {

  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email, password } = req.body;

    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { email } });

      if (!user) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "user not found");
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new APIError(
          HttpStatusCode.BAD_REQUEST,
          "Invalid email or password"
        );
      }

      const accessToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "20s" }
      );

      const refreshToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("jwt", refreshToken, {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
      });

      res.status(HttpStatusCode.OK).json({
        message: "Login successful",
        accessToken,
      });

    } catch (error) {
      next(error)
    }
  }

  static async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.cookie("jwt", "", {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        expires: new Date(0), 
      });

      res.status(HttpStatusCode.OK).json({
        message: "Logout successful",
      });
    } catch (error) {
      next(error);
    }
  }

}

