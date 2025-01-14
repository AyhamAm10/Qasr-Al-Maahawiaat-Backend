import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/data_source";
import { User, UserRole } from "../entity/Users";
import { APIError, HttpStatusCode } from "../error/api.error";
import bcrypt from "bcrypt";
import { userSchema } from "../helper/validation/validationSchemas";
import { validator } from "../helper/validation/validator";

const userRepository = AppDataSource.getRepository(User);

export class UserController {
  static async addUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const {
      username,
      email,
      password,
      isActive = true,
      role = UserRole.dataEntry,
      jobTitle,
      startDate,
      endDate,
      residencyValidity,
      fines = 0,
      discounts = 0,
      loans = 0,
      salary = 0,
      vacationDays = 0,
      weeklyHolidays = 0,
      sickDays = 0,
    } = req.body;

    try {
      await validator(userSchema, req.body);

      const hashedPassword =
        role !== UserRole.Customer ? await bcrypt.hash(password, 10) : null;

      const newUser = userRepository.create({
        ...req.body,
        password: hashedPassword,
      });

      await userRepository.save(newUser);

      res.status(HttpStatusCode.OK_CREATED).json({
        message: "User added successfully",
        user: newUser,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;

    if (!id) {
      throw new APIError(HttpStatusCode.BAD_REQUEST, "User ID is required");
    }

    try {
      const user = await userRepository.findOneBy({ id: parseInt(id, 10) });

      if (!user) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "User not found");
      }

      await userRepository.remove(user);

      res.status(HttpStatusCode.OK).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const offset = (page - 1) * limit;
      const [users, total] = await userRepository.findAndCount({
        skip: offset,
        take: limit,
        relations:["userRestaurantTools"]
      });

      if (users.length === 0) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "No users found");
      }

      const totalPages = Math.ceil(total / limit);

      res.status(HttpStatusCode.OK).json({
        message: "Users retrieved successfully",
        data:users,
        metaData: {
          currentPage: page,
          totalPages,
          totalUsers: total,
          limit,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;

    if (!id) {
      throw new APIError(HttpStatusCode.BAD_REQUEST, "User ID is required");
    }

    try {
        
      const user = await userRepository.findOne({
        where: { id: parseInt(id, 10) },
        relations: ["userRestaurantTools"],
      });

      if (!user) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "User not found");
      }

      res.status(HttpStatusCode.OK).json({
        message: "User retrieved successfully",
        user,
      });
    } catch (error) {
      next(error);
    }
  }
}
