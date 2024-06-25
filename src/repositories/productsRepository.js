import { ProductDao } from "../dao/index.js";

export const getProducts = async (query) => await ProductDao.getProducts(query);
export const getProductsById = async (id) => await ProductDao.getProductsById(id);
export const addProduct = async (body) => await ProductDao.addProduct(body);
export const updateProduct = async (id, rest) => await ProductDao.updateProduct(id, rest);
export const deleteProduct = async () => await ProductDao.deleteProduct();
