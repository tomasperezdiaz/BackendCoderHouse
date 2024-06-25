import { Router } from "express";
import {
  addProductInCart,
  createCart,
  deleteCart,
  deleteProductInCart,
  finalizarCompra,
  getCartById,
  updateProductInCart,
} from "../controllers/carts.controller.js";

const router = Router();

router.get("/:cid", getCartById);
router.post("/", createCart);
router.post("/:cid/product/:id", addProductInCart);
router.delete("/:cid/product/:id", deleteProductInCart);
router.delete("/:cid", deleteCart);
router.put("/:cid/product/:id", updateProductInCart);
router.post('/:cid/purchase', finalizarCompra);

export default router;
