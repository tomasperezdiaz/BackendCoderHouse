import { Router } from "express";
import {
  cartView,
  chatView,
  homeView,
  productsView,
  profile,
  realTimeProductsView,
} from "../controllers/views.js";
import { auth } from "../middleware/auth.js";


const router = Router();

router.get("/", homeView);
router.get("/realtimeproducts", auth(["admin"]), realTimeProductsView);
router.get("/chat", auth(["user"]), chatView);
router.get("/products", auth(["user", "premium", "admin"]), productsView);
router.get("/cart/:cid", auth(["user", "premium", "admin"]), cartView);
router.get("/profile", auth(["user", "premium", "admin"]), profile);

export default router;
