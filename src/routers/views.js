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
import role from "../middleware/role.js";

const router = Router();

router.get("/", homeView);
router.get("/realtimeproducts", role(["admin"]), realTimeProductsView);
router.get("/chat", role(["user"]), chatView);
router.get("/products", auth, productsView);
router.get("/cart/:cid", auth, cartView);
router.get("/profile" , auth,  profile);

export default router;
