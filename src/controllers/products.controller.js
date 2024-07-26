import { request, response } from "express";
import { ProductRepository } from "../repositories/index.js";
import { CustomError } from "../utils/CustomError.js";
import ERROR_TYPES from "../utils/EErrors.js";

export const getProducts = async (req = request, res = response, next) => {
  try {
    const result = await ProductRepository.getProducts({ ...req.query });
    return res.json({ result });
  } catch (error) {
    next(error);
  }
};

export const getProductsById = async (req = request, res = response, next) => {
  try {
    const { id } = req.params;
    const producto = await ProductRepository.getProductsById(id);

    if (!producto)
      return CustomError.createError(
        "ERROR",
        null,
        "Enter a valid Mongo ID",
        ERROR_TYPES.ARGUMENTOS_INVALIDOS
      );
    return res.json({ producto });
  } catch (error) {
    next(error);
  }
};

export const addProduct = async (req = request, res = response, next) => {
  try {
    const { title, description, code, price, stock, category } = req.body;

    if ((!title, !description, !code, !price, !stock, !category))
      return CustomError.createError(
        "ERROR",
        null,
        "Enter a valid Mongo ID",
        ERROR_TYPES.ARGUMENTOS_INVALIDOS
      );

    const producto = await ProductRepository.addProduct({ ...req.body, owner });
    return res.json({ producto });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req = request, res = response, next) => {
  try {
    const { id } = req.params;
    const { _id, ...rest } = req.body;
    const producto = await ProductRepository.updateProduct(id, rest);
    if (producto) return res.json({ msg: "Producto actualizado", producto });
    return CustomError.createError(
      "ERROR",
      null,
      "Enter a valid Mongo ID",
      ERROR_TYPES.ARGUMENTOS_INVALIDOS
    );
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req = request, res = response, next) => {
  try {
    const { id } = req.params;
    const producto = await ProductRepository.deleteProduct(id);
    if (producto) return res.json({ msg: "Producto eliminado", producto });

    return CustomError.createError(
      "ERROR",
      null,
      "Enter a valid Mongo ID",
      ERROR_TYPES.ARGUMENTOS_INVALIDOS
    );
  } catch (error) {
    next(error);
  }
};
