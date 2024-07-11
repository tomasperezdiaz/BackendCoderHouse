import winston from "winston";

const  ENVIRONMENT  = "production";

const loggerConfig = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "yellow",
    warning: "blue",
    info: "green",
    http: "magenta",
    debug: "white",
  },
};

winston.addColors(loggerConfig.colors);

const loggerDevelop = winston.createLogger({
  levels: loggerConfig.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({ colors: loggerConfig.colors }),
        winston.format.simple()
      ),
    }),
  ],
});

const loggerProduction = winston.createLogger({
  levels: loggerConfig.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize({ colors: loggerConfig.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "info",
      format: winston.format.simple(),
    }),
  ],
});

const logger = ENVIRONMENT === "production" ? loggerProduction : loggerDevelop;

export default logger;