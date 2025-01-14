import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./config/data_source";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.router";
import adminRoutes from "./routes/superAdmin.router";
// import { createSuperAdmin } from "./config/createSuperAdmin";
import path = require("path");
import multer = require("multer");
import { errorHandler } from "./error/error.handler";
import { swaggerDoc } from "./helper/swaggerOptions";
import { Environment } from "./environment";
import { logger } from "./logging/logger";
import productRouter from "./routes/product.router";
import variationRouter from "./routes/variation.router";
import categoryRouter from "./routes/category.router";
import recommendedRouter from "./routes/recommended.router";
import orderRouter from "./routes/order.router";
import restaurantRouter from "./routes/restaurant.router";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:8800",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ message: `Multer Error: ${err.message}` });
  } else if (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  } else {
    next();
  }
});

app.use(cookieParser());
const router = express.Router();
router.get("/", (req, res) => {
  res.send("Our awesome Web API is online!");
});

router.use("/auth", authRouter);
router.use("/users", adminRoutes);
router.use("/restaurant-tools", restaurantRouter);
router.use("/product", productRouter);
router.use("/variation", variationRouter);
router.use("/category", categoryRouter);
router.use("/recommended", recommendedRouter);
router.use("/order", orderRouter);
router.use("/order", orderRouter);
app.use(process.env.BASE_URL, router);

app.use(errorHandler);
const PORT = Number(process.env.PORT);
swaggerDoc(app);
logger.info(`NODE_ENV: ${Environment.toString()}`);

// if (Environment.isDevelopment() || Environment.isProduction()) {
//   AppDataSource.initialize()
//     .then(async () => {
//       console.log("Data Source has been initialized!");
//       await createSuperAdmin();
//     })
//     .catch((err) => {
//       console.error("Error during Data Source initialization:", err);
//     });

//   app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
//   });
// }

if (Environment.isDevelopment() || Environment.isProduction()) {
  AppDataSource.initialize()
    .then(async (connection) => {
      logger.info(
        `Database connection status: ${
          connection.isInitialized ? "Connected" : "Not Connected"
        }`
      );

      app.listen(PORT, () => {
        logger.info(`Server running at http://localhost:${PORT}`);
      });
    })
    .catch((error: Error) => {
      logger.error(error);
    });
}

export { app };
