import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/data_source";
import { Category } from "../entity/Categories";
import { APIError, HttpStatusCode } from "../error/api.error";
import { Translation } from "../entity/Translation";
import { In } from "typeorm";

const categoryRepository = AppDataSource.getRepository(Category);
const translationRepository = AppDataSource.getRepository(Translation);

export class CategoryController {
  static async add(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { translations } = req.body; 
    const mainImage = (req.files as Record<string, Express.Multer.File[]>)?.main_image?.[0];

    if (!translations || !Array.isArray(translations) || translations.length === 0) {
      throw new APIError(
        HttpStatusCode.BAD_REQUEST,
        "Translations name are required"
      );
    }

    try {
      const newCategory = categoryRepository.create({
        image_url: mainImage?.path || null,
      });
      const savedCategory = await categoryRepository.save(newCategory);

      const translationEntities = translations.map((translation:Translation) => ({
        entity: "Category",
        entityId: savedCategory.id,
        language: translation.language,
        key: "name",
        value: translation.value,
      }));
      await translationRepository.save(translationEntities);

      res.status(HttpStatusCode.OK_CREATED).json({
        message: "Category added successfully",
        data: savedCategory,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;

    try {
      const category = await categoryRepository.findOneBy({
        id: parseInt(id, 10),
      });

      if (!category) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "Category not found");
      }

      await categoryRepository.remove(category);

      res.status(HttpStatusCode.OK).json({
        message: "Category deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    const { translations } = req.body;
    const mainImage = (req.files as Record<string, Express.Multer.File[]>)?.main_image?.[0];

    try {
      const category = await categoryRepository.findOneBy({
        id: parseInt(id, 10),
      });

      if (!category) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "Category not found");
      }

      if (mainImage?.path) {
        category.image_url = mainImage.path;
      }

      const updatedCategory = await categoryRepository.save(category);

      if (translations && Array.isArray(translations)) {
        await translationRepository.delete({
          entity: "Category",
          entityId: category.id,
        });

        const translationEntities = translations.map((translation: any) => ({
          entity: "Category",
          entityId: category.id,
          language: translation.language,
          key: "name",
          value: translation.value,
        }));
        await translationRepository.save(translationEntities);
      }

      res.status(HttpStatusCode.OK).json({
        message: "Category updated successfully",
        category: updatedCategory,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { page = 1, limit = 10, lang = "en" } = req.query;
  
    const skip =
      (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);
    const take = parseInt(limit as string, 10);
  
    try {
      const [categories, total] = await categoryRepository.findAndCount({
        skip,
        take,
        order: { createdAt: "DESC" },
        relations: ["products"],
      });
  
      const categoryIds = categories.map((category) => category.id);
      const translations = await translationRepository.findBy({
        entity: "Category",
        entityId: In(categoryIds),
        language: lang as string,
      });
  
      const categoriesWithTranslations = categories.map((category) => {
        const translation = translations.find(
          (t) => t.entityId === category.id && t.key === "name"
        );
        return {
          ...category,
          name: translation?.value || null,
        };
      });
  
      res.status(HttpStatusCode.OK).json({
        message: "Categories retrieved successfully",
        data: {
          categories: categoriesWithTranslations,
        },
        metaData: {
          total,
          currentPage: parseInt(page as string, 10),
          totalPages: Math.ceil(total / take),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCategoryById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    const { language = "en" } = req.query;

    try {
      const category = await categoryRepository.findOne({
        where: { id: parseInt(id, 10) },
        relations: ["products"],
      });

      if (!category) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "Category not found");
      }

      const translation = await translationRepository.findOne({
        where: {
          entity: "Category",
          entityId: category.id,
          language: language as string,
          key: "name",
        },
      });

      res.status(HttpStatusCode.OK).json({
        message: "Category retrieved successfully",
        category: {
          ...category,
          name: translation?.value || null,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCategoryCount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const count = await categoryRepository.count();

      res.status(HttpStatusCode.OK).json({
        message: "Number of categories retrieved successfully",
        count,
      });
    } catch (error) {
      next(error);
    }
  }
}

