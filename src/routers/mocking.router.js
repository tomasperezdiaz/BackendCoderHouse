import express from "express";
import { MockingController } from "../controllers/mocking.controller.js";

const router = express.Router();

router.get("/", MockingController.generateProducts);

export default router;