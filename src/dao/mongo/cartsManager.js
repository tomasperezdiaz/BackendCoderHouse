import { cartModel } from "./models/carts.js";

export const getCartById = async (cid) =>
  await cartModel.findById(cid).populate("products.id").lean();
export const createCart = async () => await cartModel.create({});
export const addProductInCart = async (cid, id) => {
  const carrito = await cartModel.findById(cid);

  if (!carrito) return null;

  const productInCart = carrito.products.find((p) => p.id.toString() === id);

  if (productInCart) productInCart.quantity++;
  else carrito.products.push({ id: id, quantity: 1 });
  carrito.save();

  return carrito;
};

export const deleteProductInCart = async (cid, id) =>
  await cartModel.findByIdAndUpdate(
    cid,
    { $pull: { products: { id: id } } },
    { new: true }
  );
export const updateProductInCart = async (cid, id, quantity) =>
  await cartModel.findOneAndUpdate(
    { _id: cid, "products.id": id },
    { $set: { "products.$.quantity": quantity } },
    { new: true }
  );
export const deleteCart = async (cid) =>
  await cartModel.findByIdAndUpdate(
    cid,
    { $set: { products: [] } },
    { new: true }
  );
