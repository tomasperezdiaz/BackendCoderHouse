
import { Router } from "express";
import { loggerController } from "../controllers/logger.controller.js";

const loggerRouter = Router();

loggerRouter.get("/", loggerController);

export default  loggerRouter ;