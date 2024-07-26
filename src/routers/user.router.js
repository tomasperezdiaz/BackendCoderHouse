import { Router } from "express";
import { userController } from "../controllers/user.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/premium/:uid", auth(["admin", "user", "premium"]), userController);

export default router;
