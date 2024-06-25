import { CartDao } from "../dao/index.js";

export const getCartById = async (cid ) => await CartDao.getCartById(cid );
export const createCart = async () => await CartDao.createCart();
export const addProductInCart = async (cid, id) => await CartDao.addProductInCart(cid, id);
export const deleteProductInCart = async (cid, id) =>
  await CartDao.deleteProductInCart(cid, id);
export const updateProductInCart = async (cid, id, quantity) =>
  await CartDao.updateProductInCart(cid, id, quantity);
export const deleteCart = async (cid) => await CartDao.deleteCart(cid);
