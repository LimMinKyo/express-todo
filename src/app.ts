import "reflect-metadata";
import express from "express";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";
import router from "./routes";
import { AppDataSource } from "./data-source";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

dotenv.config();

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan("tiny"));
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

  // Database
  AppDataSource.initialize().then(() => console.log("☘️ DB Connection"));

  // Routers
  app.use("/api", router);

  // Server Start
  app.listen(4000, () => {
    console.log("Server Start.");
  });
}

createApp();