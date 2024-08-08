import { request, response } from "express";
import { CartRepository, ProductRepository } from "../repositories/index.js";
import UserDTO from "../dto/user.dto.js";

export const homeView = async (req = request, res = response) => {
  const limit = 100;
  const { payload } = await ProductRepository.getProducts({ limit });

  const user = req.session.user;
  let cid = null;

  if (user) {
    cid = user.cart;
  }
  return res.render("home", {
    product: payload,
    styles: "styles.css",
    title: "Inicio",
    user,
    cid,
  });
};

export const realTimeProductsView = async (req = request, res = response) => {
  const cid = req.session.user.cart;
  const user = req.session.user;
  return res.render("realTimeProducts", { styles: "styles.css", user, cid });
};

export const chatView = (req, res) => {
  const user = req.session.user;
  const cid = req.session.user.cart;
  return res.render("chat", { styles: "styles.css", user, cid });
};

export const productsView = async (req, res) => {
  const user = req.session.user;
  const result = await ProductRepository.getProducts({ ...req.query });
  const cid = req.session.user.cart;

  return res.render("products", {
    title: "productos",
    result,
    styles: "styles.css",
    user,
    cid,
  });
};

export const cartView = async (req, res) => {
  const user = req.session.user;
  const { cid } = req.params;
  const carrito = await CartRepository.getCartById(cid);

  return res.render("cart", {
    title: "cart",
    carrito,
    styles: "styles.css",
    user,
  });
};

export const loginView = async (req, res) => {
  const isAuthenticated = req.session.user !== undefined;

  if (isAuthenticated) return res.redirect("/");

  return res.render("login", { title: "Login", styles: "styles.css" });
};

export const registerView = async (req, res) => {
  const isAuthenticated = req.session.user !== undefined;

  if (isAuthenticated) return res.redirect("/");
  return res.render("register", { title: "Registro", styles: "styles.css" });
};

export const registerPostView = async (req, res) => {
  if (!req.user) {
    if (req.headers["postman-token"]) {
      return res.status(404).json({ message: "Error en el registro" });
    }
    return res.status(404).redirect("/register");
  }

  if (req.headers["postman-token"]) {
    return res
      .status(200)
      .json({ message: "Usuario creado", newUser: req.user });
  }
  return res
  .status(200)
  .json({ payload: "Successful registration", newUser: req.user });
};

export const loginPostView = async (req, res) => {
  let { web } = req.body;
  if (!req.user) {
    if (req.headers["postman-token"]) {
      return res.status(200).json({ message: "Error en el login" });
    }
    return res.status(404).redirect("/login");
  }

  req.session.user = {
    name: req.user.name,
    lastName: req.user.lastName,
    email: req.user.email,
    rol: req.user.rol,
    image: req.user.image,
    cart: req.user.cart,
  };

  if (req.headers["postman-token"]) {
    return res.status(200).json({ message: "Login exitoso", user: req.user });
  }

  if (web) {
    res.redirect("/");
  } 
  
  
  return res.json({ payload: "Successfull login" });
  
};

export const logOut = async (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.send({ status: false, body: err });
    else return res.redirect("/login");
  });
};

export const profile = async (req, res) => {
  let user = new UserDTO(req.session.user);
  let cart = { _id: req.session.user.cart };
  res.render("profile", { user, cart });
};
