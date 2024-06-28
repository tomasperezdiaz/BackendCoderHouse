import { request, response } from "express";
import { CartRepository, ProductRepository } from "../repositories/index.js";
import { ticketModel } from "../dao/mongo/models/ticket.js";
import { calcularTotal, generateUniqueCode } from "../utils/utili.js";
import { userModel } from "../dao/mongo/models/user.js";


export const getCartById = async (req = request, res = response) => {
  try {
    const { cid } = req.params;
    const carrito = await CartRepository.getCartById(cid);

    if (carrito) return res.json({ carrito });

    return res.status(404).json({ msg: "El carrito con ese ID no existe" });
  } catch (error) {
    return res.status(500).json({ msg: "Hablar con admin" });
  }
};

export const createCart = async (req = request, res = response) => {
  try {
    let carrito = await CartRepository.createCart();
    return res.json({ msg: "Carrito creado", carrito });
  } catch (error) {
    console.log("createCart ->", error);
    return res.status(500).json({ msg: "Hablar con admin" });
  }
};

export const addProductInCart = async (req = request, res = response) => {
  try {
    const { cid, id } = req.params;

    const carrito = await CartRepository.addProductInCart(cid, id);

    if (!carrito)
      return res.status(404).json({ msg: "El carrito con ese ID no existe" });

    return res.json({ msg: "Carrito actualizado", carrito });
  } catch (error) {
    return res.status(500).json({ msg: "Hablar con adminsss" });
  }
};

export const deleteProductInCart = async (req = request, res = response) => {
  try {
    const { cid, id } = req.params;
    const carrito = await CartRepository.deleteProductInCart(cid, id);
    if (!carrito)
      return res.status(404).json({ msg: "No se pudo realizar la operacion" });
    return res.json({ msg: "Producto eliminado del carrito", carrito });
  } catch (error) {
    return res.status(500).json({ msg: "Hablar con admin" });
  }
};

export const updateProductInCart = async (req = request, res = response) => {
  try {
    const { cid, id } = req.params;
    const { quantity } = req.body;

    if (!quantity || !Number.isInteger(quantity))
      return res.status(404).json({
        msg: "La propiedad quantity es obligatoria y debe ser un numero entero",
      });

    const carrito = await CartRepository.updateProductInCart(cid, id, quantity);
    console.log(carrito);
    if (!carrito)
      return res.status(404).json({ msg: "No se pudo realizar la operacion" });

    return res.json({ msg: "Producto actualizado", carrito });
  } catch (error) {
    return res.status(500).json({ msg: "Hablar con admin" });
  }
};

export const deleteCart = async (req = request, res = response) => {
  try {
    const { cid } = req.params;

    const carrito = await CartRepository.deleteCart(cid);
    if (!carrito)
      return res.status(404).json({ msg: "No se pudo realizar la operacion" });
    return res.json({ msg: "Producto actualizado", carrito });
  } catch (error) {
    return res.status(500).json({ msg: "Hablar con admin" });
  }
};

export const finalizarCompra = async (req = request, res = response) => {
  const cid = req.params.cid;
  try {
    console.log(`Iniciando proceso de compra para el carrito: ${cid}`);

    const carrito = await CartRepository.getCartById(cid);
    if (!carrito) {
      console.error("Carrito no encontrado");
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const products = carrito.products;
    console.log(`Productos en el carrito: ${JSON.stringify(products)}`);

    const productosNoDisponibles = [];

    for (const item of products) {
      const productId = item.id._id || item.id;
      console.log(`Verificando producto: ${productId}`);

      const product = await ProductRepository.getProductsById(productId);
      console.log(
        `Producto obtenido de la base de datos: ${JSON.stringify(product)}`
      );

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

    const userWithCart = await userModel.findOne(user.cart);
    if (!userWithCart) {
      console.error("Usuario con carrito no encontrado");
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const ticket = new ticketModel({
      code: generateUniqueCode(),
      purchase_datetime: new Date(),
      amount: calcularTotal(
        carrito.products.filter(
          (item) =>
            !productosNoDisponibles.includes(item.id._id || item.product)
        )
      ),
      purchaser: userWithCart._id,
    });
    await ticket.save();

    // Excluir los productos no disponibles del carrito
    carrito.products = carrito.products.filter(
      (item) => !productosNoDisponibles.includes(item.product._id || item.product)
    );
    await carrito.save();

    res.status(200).json({ productosNoDisponibles, ticketId: ticket._id });
  } catch (error) {
    console.error("Error al procesar la compra:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};