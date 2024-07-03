import { request, response } from "express";
import { CartRepository, ProductRepository } from "../repositories/index.js";
import { ticketModel } from "../dao/mongo/models/ticket.js";
import { calcularTotal, generateUniqueCode } from "../utils/utili.js";
import { userModel } from "../dao/mongo/models/user.js";
import { CustomError } from "../utils/CustomError.js";
import ERROR_TYPES from "../utils/EErrors.js";

export const getCartById = async (req = request, res = response, next) => {
  try {
    const { cid } = req.params;
    const carrito = await CartRepository.getCartById(cid);

    if (carrito) return res.json({ carrito });

    return CustomError.createError(
      "ERROR",
      null,
      "Argumentos invalidos",
      ERROR_TYPES.ARGUMENTOS_INVALIDOS
    );
  } catch (error) {
    next(error);
  }
};

export const createCart = async (req = request, res = response, next) => {
  try {
    let carrito = await CartRepository.createCart();
    return res.json({ msg: "Carrito creado", carrito });
  } catch (error) {
    next(error);
  }
};

export const addProductInCart = async (req = request, res = response, next) => {
  try {
    const { cid, id } = req.params;

    const carrito = await CartRepository.addProductInCart(cid, id);

    if (!carrito) {
      return CustomError.createError(
        "Unfilled fields",
        null,
        "Check unfilled fields",
        ERROR_TYPES.ARGUMENTOS_INVALIDOS
      );
    }
    return res.json({ msg: "Carrito actualizado", carrito });
  } catch (error) {
    next(error);
  }
};

export const deleteProductInCart = async (
  req = request,
  res = response,
  next
) => {
  try {
    const { cid, id } = req.params;
    const carrito = await CartRepository.deleteProductInCart(cid, id);
    if (!carrito)
      return CustomError.createError(
        "Error",
        null,
        "Internal server Error",
        ERROR_TYPES.INTERNAL_SERVER_ERROR
      );
    return res.json({ msg: "Producto eliminado del carrito", carrito });
  } catch (error) {
    next(error);
  }
};

export const updateProductInCart = async (
  req = request,
  res = response,
  next
) => {
  try {
    const { cid, id } = req.params;
    const { quantity } = req.body;

    if (!quantity || !Number.isInteger(quantity))
      return CustomError.createError(
        "ERROR",
        null,
        "Enter a valid Mongo ID",
        ERROR_TYPES.ARGUMENTOS_INVALIDOS
      );

    const carrito = await CartRepository.updateProductInCart(cid, id, quantity);
    console.log(carrito);
    if (!carrito)
      return CustomError.createError(
        "Error",
        null,
        "Internal server Error",
        ERROR_TYPES.INTERNAL_SERVER_ERROR
      );

    return res.json({ msg: "Producto actualizado", carrito });
  } catch (error) {
    next(error);
  }
};

export const deleteCart = async (req = request, res = response, next) => {
  try {
    const { cid } = req.params;

    const carrito = await CartRepository.deleteCart(cid);
    if (!carrito)
      return CustomError.createError(
        "ERROR",
        null,
        "Enter a valid Mongo ID",
        ERROR_TYPES.ARGUMENTOS_INVALIDOS
      );
    return res.json({ msg: "Producto actualizado", carrito });
  } catch (error) {
    next(error);
  }
};

export const finalizarCompra = async (req = request, res = response, next) => {
  const cid = req.params.cid;
  try {
    const carrito = await CartRepository.getCartById(cid);
    if (!carrito) {
      console.error("Carrito no encontrado");
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const products = carrito.products;

    const productosNoDisponibles = [];

    for (const item of products) {
      const productId = item.id._id || item.id;

      const product = await ProductRepository.getProductsById(productId);

      if (!product) {
        console.error(`Producto no encontrado: ${productId}`);
        productosNoDisponibles.push(productId);
        continue;
      }

      if (product.status === undefined || product.category === undefined) {
        console.error(`Producto con campos faltantes: ${productId}`);
        productosNoDisponibles.push(productId);
        continue;
      }

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();
      } else {
        productosNoDisponibles.push(productId);
      }
    }
   
    const userWithCart = await userModel.findOne({ cart: cid });

    if (!userWithCart) {
      console.error("Usuario con carrito no encontrado");
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    const validProducts = carrito.products.filter(
      (item) =>
        !productosNoDisponibles.includes(item.id._id || item.product) &&
        item.id.code
    );

    if (validProducts.length === 0) {
      return res
        .status(400)
        .json({ error: "No hay productos disponibles para la compra" });
    }

    const ticket = new ticketModel({
      code: generateUniqueCode(),
      purchase_datetime: new Date(),
      amount: calcularTotal(validProducts),
      purchaser: userWithCart._id,
      products: validProducts.map((item) => ({
        productId: item.id._id,
        title: item.id.title,
        price: item.id.price,
        quantity: item.quantity,
        code: item.id.code,
      })),
    });

    await ticket.save();

    carrito.products = carrito.products.filter(
      (item) => !productosNoDisponibles.includes(item.id._id || item.product)
    );

    res.status(200).json({ productosNoDisponibles, ticketId: ticket._id });
  } catch (error) {
    next(error);
  }
};
