import { request, response } from "express";
import { ProductRepository } from "../repositories/index.js";



export const getProducts = async (req = request, res = response) => {
  try {
    const result = await ProductRepository.getProducts({ ...req.query });
    return res.json({ result });
  } catch (error) {
    console.log("getProducts ->", error);
    return res.status(500).json({ msg: "Hablar con admin" });
  }
};

export const getProductsById = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const producto = await ProductRepository.getProductsById(id);

    if (!producto)
      return res.status(404).json({ msg: "El producto con ese ID no existe" });
    return res.json({ producto });
  } catch (error) {
    console.log("getProductsById ->", error);
    return res.status(500).json({ msg: "Hablar con admin" });
  }
};

export const addProduct = async (req = request, res = response) => {
  try {
    const { title, description, code, price, stock, category } = req.body;
    
    if ((!title, !description, !code, !price, !stock, !category))
      return res.status(404).json({
        msg: "Los campos [title,description,code,price,stock,category] son obligatorios ",
      });

    const producto = await ProductRepository.addProduct({ ...req.body });
    return res.json({ producto });

  } catch (error) {
    return res.status(500).json({ msg: "Hablar con admin" });
  }
};

export const updateProduct = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const { _id, ...rest } = req.body;
    const producto = await ProductRepository.updateProduct(id, rest);
    if (producto) return res.json({ msg: "Producto actualizado", producto });
    return res.status(404).json({ msg: "El producto no se pudo actualizar" });
  } catch (error) {
    return res.status(500).json({ msg: "Hablar con admin" });
  }
};

export const deleteProduct = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const producto = await ProductRepository.deleteProduct(id);
    if (producto) return res.json({ msg: "Producto eliminado", producto });
    return res.status(404).json({ msg: "El producto no se pudo eliminar" });
  } catch (error) {
    console.log("deleteProduct ->", error);
    return res.status(500).json({ msg: "Hablar con admin" });
  }
};


