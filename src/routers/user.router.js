import express from "express";
import usercontroller from "../controllers/user.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/premium/:uid",
  auth(["admin", "user", "premium"]),
  usercontroller.roleChange
);

export default router;


