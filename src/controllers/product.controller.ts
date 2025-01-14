import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/data_source";
import { Product } from "../entity/Products";
import { APIError, HttpStatusCode } from "../error/api.error";
import { Category } from "../entity/Categories";
import { Variation } from "../entity/Variation";
import { ProductData } from "../entity/ProductData";
import { Like } from "typeorm";
import { validator } from "../helper/validation/validator";
import { productSchema } from "../helper/validation/validationSchemas";
import { Translation } from "../entity/Translation";

const productRepository = AppDataSource.getRepository(Product);
const categoryRepository = AppDataSource.getRepository(Category);
const variationRepository = AppDataSource.getRepository(Variation);
const productDataRepository = AppDataSource.getRepository(ProductData);
const translationRepository = AppDataSource.getRepository(Translation);
export class ProductController {
  static async add(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { translations, base_price, offer_price, category_id, productData } =
      req.body;
    // await validator(productSchema , req.body)
    const mainImage = (req.files as Record<string, Express.Multer.File[]>)
      ?.main_image?.[0];

    if (!mainImage) {
      throw new APIError(HttpStatusCode.BAD_REQUEST, "Main image is required");
    }

    if (!base_price) {
      throw new APIError(
        HttpStatusCode.BAD_REQUEST,
        "Name, details, and base price are required"
      );
    }

    try {
      const newProduct = productRepository.create({
        translations: translations.map((t: any) =>
          translationRepository.create({
            entity: "product",
            entityId: 0,
            language: t.language,
            key: t.key,
            value: t.value,
          })
        ),
        image_url: mainImage.path,
        base_price,
        offer_price,
        category: category_id ? { id: category_id } : null,
      });

      if (productData && Array.isArray(productData)) {
        const productDataList = await Promise.all(
          productData.map(async (data: any) => {
            const variation = await variationRepository.findOne({
              where: { id: data.variation_id },
            });

            if (!variation) {
              throw new APIError(
                HttpStatusCode.BAD_REQUEST,
                `Variation with ID ${data.variation_id} not found`
              );
            }

            const variationImage = (
              req.files as Record<string, Express.Multer.File[]>
            )[`variation_images`]?.find(
              (file) =>
                file.fieldname === `variation_images[${data.variation_id}]`
            );

            if (!variationImage) {
              throw new APIError(
                HttpStatusCode.BAD_REQUEST,
                `Image for variation with ID ${data.variation_id} is required`
              );
            }

            return productDataRepository.create({
              image: variationImage.path,
              price_For_variation: data.price_For_variation,
              offer_for_variation: data.offer_for_variation,
              product: newProduct,
              variation,
            });
          })
        );

        await productDataRepository.save(productDataList);
        newProduct.productsData = productDataList;
      }

      const savedProduct = await productRepository.save(newProduct);

      for (const translation of savedProduct.translations) {
        translation.entityId = savedProduct.id;
        await translationRepository.save(translation);
      }

      res.status(HttpStatusCode.OK_CREATED).json({
        message: "Product added successfully",
        data: savedProduct,
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

    if (!id) {
      throw new APIError(HttpStatusCode.BAD_REQUEST, "Product ID is required");
    }

    try {
      const product = await productRepository.findOneBy({
        id: parseInt(id, 10),
      });

      if (!product) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "Product not found");
      }

      await productRepository.remove(product);

      res.status(HttpStatusCode.OK).json({
        message: "Product deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // static async update(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   const { id } = req.params;
  //   const { name, details, base_price, offer_price, category_id, variations } =
  //     req.body;
  //   const image_url = req.file?.path;

  //   if (!id) {
  //     throw new APIError(HttpStatusCode.BAD_REQUEST, "Product ID is required");
  //   }

  //   try {
  //     const product = await productRepository.findOne({
  //       where: { id: parseInt(id, 10) },
  //       relations: ["productsData"],
  //     });

  //     if (!product) {
  //       throw new APIError(HttpStatusCode.NOT_FOUND, "Product not found");
  //     }

  //     Object.assign(product, {
  //       name: name ?? product.name,
  //       image_url: image_url ?? product.image_url,
  //       details: details ?? product.details,
  //       base_price: base_price ?? product.base_price,
  //       offer_price: offer_price ?? product.offer_price,
  //       category: category_id ? { id: category_id } : product.category,
  //     });

  //     if (variations && variations.length > 0) {
  //       await productDataRepository.remove(product.productsData);
  //       const newProductData = variations.map((variation: any) =>
  //         productDataRepository.create({
  //           ...variation,
  //           product,
  //         })
  //       );
  //       await productDataRepository.save(newProductData);
  //       product.productsData = newProductData;
  //     }

  //     await productRepository.save(product);

  //     res.status(HttpStatusCode.OK).json({
  //       message: "Product updated successfully",
  //       product,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  static async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    const {
      name,
      details,
      base_price,
      offer_price,
      category_id,
      variations,
      translations,
    } = req.body;
    const image_url = req.file?.path;

    if (!id) {
      throw new APIError(HttpStatusCode.BAD_REQUEST, "Product ID is required");
    }

    try {
      const product = await productRepository.findOne({
        where: { id: parseInt(id, 10) },
        relations: ["productsData", "translations"],
      });

      if (!product) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "Product not found");
      }

      Object.assign(product, {
        // name: name ?? product.name,
        image_url: image_url ?? product.image_url,
        // details: details ?? product.details,
        base_price: base_price ?? product.base_price,
        offer_price: offer_price ?? product.offer_price,
        category: category_id ? { id: category_id } : product.category,
      });

      if (variations && variations.length > 0) {
        await productDataRepository.remove(product.productsData);

        const newProductData = variations.map((variation: any) =>
          productDataRepository.create({
            ...variation,
            product,
          })
        );
        await productDataRepository.save(newProductData);
        product.productsData = newProductData;
      }

      if (translations && translations.length > 0) {

        const translationToRemove = translationRepository.find({
         where:{product:product}
        })

        console.log(translationToRemove)
        ;(await translationToRemove).map((item:Translation)=>{
          translationRepository.remove(item)
        })
        await translationRepository.delete({ product: { id: product.id } });

        const newTranslations = translations.map((translation: any) =>
          translationRepository.create({
            language: translation.language,
            key: translation.key,
            value: translation.value,
            product,
          })
        );

        await translationRepository.save(newTranslations);
        product.translations = newTranslations;
      }

      await productRepository.save(product);

      res.status(HttpStatusCode.OK).json({
        message: "Product updated successfully",
        product,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        name,
        category_id,
        min_price,
        max_price,
        lang = "en",
      } = req.query;

      const whereConditions: any = {};

      if (name) {
        whereConditions.name = Like(`%${name}%`);
      }

      if (category_id) {
        whereConditions.category = { id: category_id };
      }

      if (min_price || max_price) {
        whereConditions.base_price = {};
        if (min_price) whereConditions.base_price.$gte = min_price;
        if (max_price) whereConditions.base_price.$lte = max_price;
      }

      const products = await productRepository.find({
        where: whereConditions,
        relations: ["category", "productsData", "translations"],
      });

      if (products.length === 0) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "No products found");
      }

      const productsAfterTranslations = products.map((product) => {
        const productWithTranslations = {
          ...product,
          ...product.translations
            .filter((t) => t.language === lang)
            .reduce((acc, translation) => {
              acc[translation.key] = translation.value;
              return acc;
            }, {}),
        };

        delete productWithTranslations.translations;
        return productWithTranslations;
      });

      console.log(products);

      res.status(HttpStatusCode.OK).json({
        message: "Products retrieved successfully",
        data: productsAfterTranslations,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    const { lang = "en" } = req.query;

    if (!id) {
      throw new APIError(HttpStatusCode.BAD_REQUEST, "Product ID is required");
    }

    try {
      const product = await productRepository.findOne({
        where: { id: parseInt(id, 10) },
        relations: ["category", "productsData", "translations"],
      });

      if (!product) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "Product not found");
      }

      const productWithTranslations = {
        ...product,
        ...product.translations
          .filter((t) => t.language === lang)
          .reduce((acc, translation) => {
            acc[translation.key] = translation.value;
            return acc;
          }, {}),
      };

      delete productWithTranslations.translations;

      res.status(HttpStatusCode.OK).json({
        message: "Product retrieved successfully",
        product: productWithTranslations,
      });
    } catch (error) {
      next(error);
    }
  }

  // static async getProductsByCategoryId(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   const { categoryId } = req.params;

  //   if (!categoryId) {
  //     throw new APIError(HttpStatusCode.BAD_REQUEST, "Category ID is required");
  //   }

  //   try {
  //     const category = await categoryRepository.findOneBy({
  //       id: parseInt(categoryId, 10),
  //     });

  //     if (!category) {
  //       throw new APIError(HttpStatusCode.NOT_FOUND, "Category not found");
  //     }

  //     const products = await productRepository.find({
  //       where: { category: { id: parseInt(categoryId, 10) } },
  //       relations: ["variations", "category", "recommended"],
  //     });

  //     res.status(HttpStatusCode.OK).json({
  //       message: "Products retrieved successfully",
  //       products,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  static async getProductsByCategoryId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { categoryId } = req.params;
    const { lang="en" } = req.query;
  
    if (!categoryId) {
      throw new APIError(HttpStatusCode.BAD_REQUEST, "Category ID is required");
    }
  
    try {
      const category = await categoryRepository.findOneBy({
        id: parseInt(categoryId, 10),
      });
  
      if (!category) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "Category not found");
      }
  
      const products = await productRepository.find({
        where: { category: { id: parseInt(categoryId, 10) } },
        relations: ["productsData", "category", "recommended", "translations"],
      });
  
      if (products.length === 0) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "No products found in this category");
      }
  
      const productsWithTranslations = products.map((product) => {
        const productWithTranslations = { ...product };
  
        product.translations
          .filter((t) => t.language === lang)
          .forEach((translation) => {
            productWithTranslations[translation.key] = translation.value;
          });
  
        delete productWithTranslations.translations;
  
        return productWithTranslations;
      });
  
      res.status(HttpStatusCode.OK).json({
        message: "Products retrieved successfully",
        products: productsWithTranslations,
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async addOffer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    const { offer_price } = req.body;

    if (!id || offer_price === undefined) {
      throw new APIError(
        HttpStatusCode.BAD_REQUEST,
        "Product ID and offer price are required"
      );
    }

    try {
      const product = await productRepository.findOneBy({
        id: parseInt(id, 10),
      });

      if (!product) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "Product not found");
      }

      product.offer_price = offer_price;
      await productRepository.save(product);

      res.status(HttpStatusCode.OK).json({
        message: "Offer added successfully",
        product,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteOffer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;

    if (!id) {
      throw new APIError(HttpStatusCode.BAD_REQUEST, "Product ID is required");
    }

    try {
      const product = await productRepository.findOneBy({
        id: parseInt(id, 10),
      });

      if (!product) {
        throw new APIError(HttpStatusCode.NOT_FOUND, "Product not found");
      }

      product.offer_price = null;
      await productRepository.save(product);

      res.status(HttpStatusCode.OK).json({
        message: "Offer deleted successfully",
        product,
      });
    } catch (error) {
      next(error);
    }
  }
}
