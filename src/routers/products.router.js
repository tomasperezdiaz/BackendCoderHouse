import { Router } from "express";
import { addProduct, deleteProduct, getProducts, getProductsById, updateProduct } from "../controllers/products.controller.js";
 
const router = Router();

router.get("/", getProducts );
router.get("/:id", getProductsById);
router.post("/", addProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
