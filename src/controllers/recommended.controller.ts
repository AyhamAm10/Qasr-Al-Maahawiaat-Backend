import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/data_source";
import { Recommended } from "../entity/Recommended";
import { Product } from "../entity/Products";
import { APIError, HttpStatusCode } from "../error/api.error";

const recommendedRepository = AppDataSource.getRepository(Recommended);
const productRepository = AppDataSource.getRepository(Product);

export class RecommendedController {

  static async getRecommendedProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const recommendedProducts = await recommendedRepository.find({
        relations: ["product"],
      });

      if (recommendedProducts.length === 0) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "No recommended products found");
      }

      res.status(HttpStatusCode.OK).json({
        message: "Recommended products retrieved successfully",
        recommendedProducts,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getRecommendedProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;

    if (!id) {
      throw new APIError(HttpStatusCode.BAD_REQUEST, "Recommended product ID is required");
    }

    try {
      const recommendedProduct = await recommendedRepository.findOne({
        where: { id: parseInt(id, 10) },
        relations: ["product"],
      });

      if (!recommendedProduct) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "Recommended product not found");
      }

      res.status(HttpStatusCode.OK).json({
        message: "Recommended product retrieved successfully",
        recommendedProduct,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getRecommendedProductNumber(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const count = await recommendedRepository.count();

      res.status(HttpStatusCode.OK).json({
        message: "Total recommended products retrieved successfully",
        count,
      });
    } catch (error) {
      next(error);
    }
  }

  static async addRecommended(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { productId } = req.body;

    if (!productId) {
      throw new APIError(HttpStatusCode.BAD_REQUEST, "Product ID is required");
    }

    try {
      const product = await productRepository.findOne({ where: { id: productId } });

      if (!product) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "Product not found");
      }

      const existingRecommendation = await recommendedRepository.findOne({
        where: { product: { id: productId } },
      });

      if (existingRecommendation) {
        throw new APIError(HttpStatusCode.BAD_REQUEST, "Product is already recommended");
      }

      const newRecommended = recommendedRepository.create({ product });

      await recommendedRepository.save(newRecommended);

      res.status(HttpStatusCode.OK_CREATED).json({
        message: "Recommended product added successfully",
        recommended: newRecommended,
      });
    } catch (error) {
      next(error);
    }
  }

  static async removeRecommended(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;

    if (!id) {
      throw new APIError(HttpStatusCode.BAD_REQUEST, "Recommended product ID is required");
    }

    try {
      const recommendedProduct = await recommendedRepository.findOne({
        where: { id: parseInt(id, 10) },
      });

      if (!recommendedProduct) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "Recommended product not found");
      }

      await recommendedRepository.remove(recommendedProduct);

       res.status(HttpStatusCode.OK).json({
        message: "Recommended product removed successfully",
      });
    } catch (error) {
      next(error);
    }
  }

}
