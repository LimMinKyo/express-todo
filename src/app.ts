import "reflect-metadata";
import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";
import router from "./routes";
import { AppDataSource } from "./data-source";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { logger } from "./utils/logger";

dotenv.config();

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(
    morgan(":method :status :url :response-time ms", {
      stream: {
        write: (message) => {
          logger.info(message);
        },
      },
    })
  );
  app.use(express.static("public"));

  // Health Check
  app.get("/", (req, res) => {
    res.send("OK");
  });

  // Swagger
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      explorer: true,
      swaggerOptions: {
        url: "/swagger.json",
      },
    })
  );

  // Routers
  app.use("/api", router);

  // Error
  app.use((error: any, req: Request, res: Response) => {
    logger.error(error.stack);
    res
      .status(error.status || 500)
      .send({ ok: false, message: error.message || "INTERNAL_SERVER_ERROR" });
  });

  if (process.env.NODE_ENV !== "test") {
    // Database
    AppDataSource.initialize()
      .then(() => logger.info("☘️ DB Connection"))
      .catch((error) => logger.error(error));

    // Server Start
    app.listen(process.env.PORT || 4000, () => {
      console.log("Server Start.");
    });
  }

  return app;
}

createApp();
