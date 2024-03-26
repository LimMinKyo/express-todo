import colors from "colors/safe";
import winston from "winston";
import winstonDailyLog from "winston-daily-rotate-file";

const { combine, timestamp, printf, colorize } = winston.format;

const LOG_DIR = "../../logs";
const LOG_MAX_FILES = 30;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

const logFormat = printf((info) => {
  let message = info.message;

  if (info.level === "error") {
    if (info.responseMessage) {
      message += " (response message : " + info.responseMessage + ")";
    }
    if (info.stack) {
      message += "\n" + info.stack;
    }
  }

  let fullMessage = `[#${process.pid}] ${info.timestamp} [${info.level}] ${message}`;

  if (info.level == "error") {
    fullMessage = colors.red(fullMessage);
  }

  if (info.level === "warn") {
    fullMessage = colors.yellow(fullMessage);
  }

  return fullMessage;
});

const logger = winston.createLogger({
  exitOnError: false,
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss.SSS",
    }),
    logFormat
  ),
  transports: [
    new winstonDailyLog({
      level: "info",
      datePattern: "YYYY-MM-DD",
      filename: "%DATE%.log",
      dirname: LOG_DIR,
      maxFiles: LOG_MAX_FILES,
      zippedArchive: IS_PRODUCTION,
    }),
    new winstonDailyLog({
      level: "warn",
      datePattern: "YYYY-MM-DD",
      filename: "%DATE%.warn.log",
      dirname: LOG_DIR + "/warn",
      maxFiles: LOG_MAX_FILES,
      zippedArchive: IS_PRODUCTION,
    }),
    new winstonDailyLog({
      level: "error",
      datePattern: "YYYY-MM-DD",
      filename: `%DATE%.error.log`,
      dirname: LOG_DIR + "/error",
      maxFiles: LOG_MAX_FILES,
      zippedArchive: IS_PRODUCTION,
    }),
  ],
});

if (!IS_PRODUCTION) {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize({ all: true }), logFormat),
    })
  );
}

export { logger };
