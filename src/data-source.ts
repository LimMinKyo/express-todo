import { DataSource } from "typeorm";

import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT || ""),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.DB_SYNCHRONIZE === "true",
  logging: true,
  migrationsRun: false,
  migrationsTableName: "migrations",
  entities: [__dirname + "/entities/*.entity.ts"],
  migrations: [__dirname + "/migrations/**/*.ts"],
  subscribers: [__dirname + "/subscriber/**/*.ts"],
});
