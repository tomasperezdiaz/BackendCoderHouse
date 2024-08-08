import { Router } from "express";
import {
  logOut,
  loginPostView,
  loginView,
  profile,
  registerPostView,
  registerView,
} from "../controllers/views.js";

import passport from "passport";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/profile", auth, profile);
router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/register" }),
  registerPostView
);
router.get("/login", loginView);
router.get("/register", registerView);
router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/login", }),
  loginPostView
);
router.get("/logout", logOut);


router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/login-github-callack",
  passport.authenticate("github", { failureRedirect: "/register" }),
  loginPostView
);

export default router;
