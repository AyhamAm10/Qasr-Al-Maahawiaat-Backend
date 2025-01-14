import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/data_source";
import { Variation } from "../entity/Variation";
import { APIError, HttpStatusCode } from "../error/api.error";
import { Translation } from "../entity/Translation";

const variationRepository = AppDataSource.getRepository(Variation);
const translationRepository = AppDataSource.getRepository(Translation);

export class VariationController {
  static async getVariations(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { lang = "en" } = req.query;
    try {

      const variations = await variationRepository.find({
        relations: ["translations"],
      });

      if (variations.length === 0) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "No variations found");
      }

      const variationIds = variations.map((category) => category.id);
      const translations = await translationRepository.findBy({
        entity: "variation",
        language: lang as string,
      });

      const variationsWithTranslations = variationIds.map((variation:any) => {
        const translation = translations.find(
          (t) => t.entityId === variation.id && t.key === "name"
        );
        return {
          name: translation?.value || null,
        };
      });
      

      res.status(HttpStatusCode.OK).json({
        message: "Variations retrieved successfully",
        data:variationsWithTranslations,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getVariationById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    const { lang = "en" } = req.query;

    if (!id) {
      throw new APIError(HttpStatusCode.BAD_REQUEST, "Variation ID is required");
    }

    try {
      const variation = await variationRepository.findOne({
        where: { id: parseInt(id, 10) },
        relations: ["translations"],
      });

      if (!variation) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "Variation not found");
      }

      const translation = await translationRepository.findOneBy({
        entity: "variation",
        entityId: parseInt(id, 10),
        language: lang as string,
        key: "name",
      });

      res.status(HttpStatusCode.OK).json({
        message: "Variation retrieved successfully",
        data: {
          id: variation.id,
          name: translation?.value || null,
          createdAt: variation.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async addVariation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { translations } = req.body;

    if (!translations || !Array.isArray(translations)) {
      throw new APIError(
        HttpStatusCode.BAD_REQUEST,
        "Translations are required and must be an array"
      );
    }

    try {
      const newVariation = variationRepository.create({ translations });
      const savedVariation = await variationRepository.save(newVariation);

      const translationEntities = translations.map((translation:Translation) => ({
              entity: "variation",
              entityId: savedVariation.id,
              language: translation.language,
              key: "name",
              value: translation.value,
            }));
            await translationRepository.save(translationEntities);

      res.status(HttpStatusCode.OK_CREATED).json({
        message: "Variation added successfully",
        data: newVariation,
      });
    } catch (error) {
      next(error);
    }
  }


  static async updateVariation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    const { translations } = req.body;

    if (!id) {
      throw new APIError(
        HttpStatusCode.BAD_REQUEST,
        "Variation ID is required"
      );
    }

    try {
      const variation = await variationRepository.findOne({
        where: { id: parseInt(id, 10) },
        relations: ["translations"],
      });

      if (!variation) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "Variation not found");
      }

      if (translations && Array.isArray(translations)) {
        variation.translations = translations;
      }

      await variationRepository.save(variation);

      res.status(HttpStatusCode.OK).json({
        message: "Variation updated successfully",
        variation,
      });
    } catch (error) {
      next(error);
    }
  }

  static async removeVariation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;

    if (!id) {
      throw new APIError(
        HttpStatusCode.BAD_REQUEST,
        "Variation ID is required"
      );
    }

    try {
      const variation = await variationRepository.findOne({
        where: { id: parseInt(id, 10) },
      });

      if (!variation) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "Variation not found");
      }

      await variationRepository.remove(variation);

      res.status(HttpStatusCode.OK).json({
        message: "Variation removed successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
