import { Router } from "express";
import {
  requestPasswordReset,
  sendPasswordResetEmail,
  resetPassword,
  updatePassword,
} from "../controllers/passwordReset.controller.js";

export const router = Router();

router.get("/requestpassword", requestPasswordReset);
router.post("/requestpassword", sendPasswordResetEmail);
router.get("/reset/:token", resetPassword);
router.post("/reset/:token", updatePassword);

export default router;
