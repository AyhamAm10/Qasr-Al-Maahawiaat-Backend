import { Request, Response, NextFunction } from "express";
import { User } from "../entity/Users";
import { UserRestaurantTool } from "../entity/UserRestaurantTool";
import { RestaurantTool } from "../entity/RestaurantTool";
import { APIError } from "../error/api.error";
import { HttpStatusCode } from "../error/api.error";
import { AppDataSource } from "../config/data_source";

const userRepository = AppDataSource.getRepository(User);
const restaurantToolRepository = AppDataSource.getRepository(RestaurantTool);
export class HRController {
  static async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    const {
      username,
      email,
      password,
      role,
      jobTitle,
      startDate,
      endDate,
      residencyValidity,
    } = req.body;

    if (!id) {
      throw new APIError(HttpStatusCode.BAD_REQUEST, "User ID is required");
    }

    try {
      const user = await userRepository.findOne({
        where: { id: Number(id) },
        relations: ["userRestaurantTools"],
      });

      if (!user) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "User not found");
      }

      user.username = username || user.username;
      user.email = email || user.email;
      user.password = password || user.password;
      user.role = role || user.role;
      user.jobTitle = jobTitle || user.jobTitle;
      user.startDate = startDate || user.startDate;
      user.endDate = endDate || user.endDate;
      user.residencyValidity = residencyValidity || user.residencyValidity;

      const updatedUser = await userRepository.save(user);

      res.status(HttpStatusCode.OK).json({
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  static async addPenaltiesAndDiscounts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { userId, fines, discounts } = req.body;

    if (!userId) {
      throw new APIError(HttpStatusCode.BAD_REQUEST, "User ID is required");
    }

    try {
      const user = await userRepository.findOne({
        where: { id: Number(userId) },
      });

      if (!user) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "User not found");
      }

      user.fines = fines || user.fines;
      user.discounts = discounts || user.discounts;

      const updatedUser = await userRepository.save(user);

      res.status(HttpStatusCode.OK).json({
        message: "Penalties and discounts added successfully",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  static async addLoan(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { userId, loanAmount } = req.body;

    if (!userId) {
      throw new APIError(HttpStatusCode.BAD_REQUEST, "User ID is required");
    }

    try {
      const user = await userRepository.findOne({
        where: { id: Number(userId) },
      });

      if (!user) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "User not found");
      }

      user.loans += loanAmount;

      const updatedUser = await userRepository.save(user);

      res.status(HttpStatusCode.OK).json({
        message: "Loan added successfully",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  static async addSalary(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { userId, salary } = req.body;

    if (!userId) {
      throw new APIError(HttpStatusCode.BAD_REQUEST, "User ID is required");
    }

    try {
      const user = await userRepository.findOne({
        where: { id: Number(userId) },
      });

      if (!user) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "User not found");
      }

      user.salary = salary || user.salary;

      const updatedUser = await userRepository.save(user);

      res.status(HttpStatusCode.OK).json({
        message: "Salary updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  static async addVacationDays(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { userId, vacationDays } = req.body;

    if (!userId) {
      throw new APIError(HttpStatusCode.BAD_REQUEST, "User ID is required");
    }

    try {
      const user = await userRepository.findOne({
        where: { id: Number(userId) },
      });

      if (!user) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "User not found");
      }

      user.vacationDays += vacationDays;

      const updatedUser = await userRepository.save(user);

      res.status(HttpStatusCode.OK).json({
        message: "Vacation days added successfully",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  static async addWeeklyHolidays(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { userId, weeklyHolidays } = req.body;

    if (!userId) {
      throw new APIError(HttpStatusCode.BAD_REQUEST, "User ID is required");
    }

    try {
      const user = await userRepository.findOne({
        where: { id: Number(userId) },
      });

      if (!user) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "User not found");
      }

      user.weeklyHolidays = weeklyHolidays;

      const updatedUser = await userRepository.save(user);

      res.status(HttpStatusCode.OK).json({
        message: "Weekly holidays updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  static async addSickDays(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { userId, sickDays } = req.body;

    if (!userId) {
      throw new APIError(HttpStatusCode.BAD_REQUEST, "User ID is required");
    }

    try {
      const user = await userRepository.findOne({
        where: { id: Number(userId) },
      });

      if (!user) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "User not found");
      }

      user.sickDays += sickDays;

      const updatedUser = await userRepository.save(user);

      res.status(HttpStatusCode.OK).json({
        message: "Sick days updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  static async addRestaurantTool(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { name, quantity, available } = req.body;

    if (!name || !quantity || !available ) {
      throw new APIError(
        HttpStatusCode.BAD_REQUEST,
        "Name, quantity, and available are required"
      );
    }

    try {
      const newRestaurantTool = restaurantToolRepository.create({
        name,
        quantity,
        available,
      });

      const savedRestaurantTool = await restaurantToolRepository.save(
        newRestaurantTool
      );

      res.status(HttpStatusCode.OK_CREATED).json({
        message: "Restaurant tool added successfully",
        data: savedRestaurantTool,
      });
    } catch (error) {
      next(error);
    }
  }

  static async assignRestaurantToolToUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { userId, toolId, reservedQuantity } = req.body;

    if (!userId || !toolId) {
      throw new APIError(
        HttpStatusCode.BAD_REQUEST,
        "User ID and Tool ID are required"
      );
    }

    try {
      const user = await userRepository.findOne({
        where: { id: userId },
      });
      const tool = await restaurantToolRepository.findOne({
        where: { id: toolId },
      });

      if (!user || !tool) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "User or tool not found");
      }

      const userTool = AppDataSource.getRepository(UserRestaurantTool).create({
        user,
        restaurantTool: tool,
        reservedQuantity,
      });

      const savedUserTool = await AppDataSource.getRepository(UserRestaurantTool).save(
        userTool
      );

      res.status(HttpStatusCode.OK_CREATED).json({
        message: "Restaurant tool assigned to user successfully",
        data: savedUserTool,
      });
    } catch (error) {
      next(error);
    }
  }
}
