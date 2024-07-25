import { Router } from "express";
import { UserController } from "../controllers/user.js";
import role from "../middleware/role.js";
export const router = Router();

router.get(
  "/premium/:uid",
  role(["admin", "user", "premium"]),
  UserController.roleChange
);

export default router;
