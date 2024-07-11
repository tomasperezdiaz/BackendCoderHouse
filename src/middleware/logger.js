import logger from "../utils/logger.js";

const newLogger = (request, response, next) => {
  request.logger = logger;
  request.logger.http(
    `${request.method} en ${request.url} - ${new Date().toLocaleTimeString()}`
  );
  next();
};

export default newLogger;