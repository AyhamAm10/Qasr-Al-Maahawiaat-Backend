import { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Express with typeOrm",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  servers: [
    {
      url: "http://localhost:3000/",
    },
  ],

  apis: [
    "./src/swagger/order.docs.yaml",
    "./src/swagger/auth.docs.yaml",
    "./src/swagger/superAdmin.docs.yaml",
    "./src/swagger/category.docs.yaml",
    "./src/swagger/products.docs.yaml",
    "./src/swagger/recommended.docs.yaml",
    "./src/swagger/variation.docs.yaml",
    "./src/swagger/hr.docs.yaml",
    "./src/swagger/order.yaml",
  ],
};


const swaggerSpec = swaggerJsdoc(options);


function swaggerDoc(app: Express) {
  // app.use("/docs", swaggerUi.serve, (...args) =>
  //   swaggerUi.setup(swaggerSpec)(...args)
  // );

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

}

export { swaggerDoc };
