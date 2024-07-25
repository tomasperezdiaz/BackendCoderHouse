import { Router } from "express";
import { addProduct, deleteProduct, getProducts, getProductsById, updateProduct } from "../controllers/products.controller.js";
import role from "../middleware/role.js";
 
const router = Router();

router.get("/", getProducts );
router.get("/:id", getProductsById);
router.post("/",role(["admin"]), addProduct);
router.put("/:id",role(["admin"]), updateProduct);
router.delete("/:id",role(["admin", "premium"]), deleteProduct);

export default router;
