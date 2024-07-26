import { Router } from "express";
import { addProduct, deleteProduct, getProducts, getProductsById, updateProduct } from "../controllers/products.controller.js";
import { auth } from "../middleware/auth.js";
 
const router = Router();

router.get("/", getProducts );
router.get("/:id", getProductsById);
router.post("/",auth(["admin", "premium"]), addProduct);
router.put("/:id",auth(["admin"]), updateProduct);
router.delete("/:id",auth(["admin", "premium"]), deleteProduct);

export default router;
