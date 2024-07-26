import { ProductDao } from "../dao/index.js";

export const getProducts = async (query) => await ProductDao.getProducts(query);
export const getProductsById = async (id) =>
  await ProductDao.getProductsById(id);
export const addProduct = async (body, owner) =>
  await ProductDao.addProduct(body, owner);
export const updateProduct = async (id, rest) =>
  await ProductDao.updateProduct(id, rest);
export const deleteProduct = async (id) => await ProductDao.deleteProduct(id);
