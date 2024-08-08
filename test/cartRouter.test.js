import { isValidObjectId, mongoose } from "mongoose";
import { after, before, describe, it } from "mocha";
import supertest from "supertest-session";
import { expect } from "chai";
import { fakerEN_US as faker } from "@faker-js/faker";
import { productoModel } from "../src/dao/mongo/models/products.js";
import { cartModel } from "../src/dao/mongo/models/carts.js";

const requester = supertest("http://localhost:8080");

const mockProduct = {
  title: "test",
  description: "cart test",
  code: faker.string.alphanumeric(10),
  price: faker.commerce.price({ min: 10, max: 500 }),
  status: true,
  stock: faker.number.int({ min: 1, max: 100 }),
  category: faker.commerce.productAdjective(),
  thumbnails: [faker.image.url()],
};

let premium = {
  email: "premium@gmail.com",
  password: "premium",
};

let user = { email: "admin@gmail.com", password: "admin" };

mongoose.set("bufferCommands", false);
mongoose.set("bufferTimeoutMS", 30000);

describe("Router de carts", function () {
  this.timeout(100000);

  before(async function () {
    try {
      await mongoose.connect(
        "mongodb+srv://tomasperezdiaz03:789456123@database.dy0snpa.mongodb.net/ecommerce"
      );
      await requester.post("/login").send(user);
    } catch (error) {
      console.error("Error during setup:", error);
    }
  });

  afterEach(async function () {
    try {
      await mongoose.connection
        .collection("carts")
        .deleteMany({ title: "test" });
    } catch (error) {
      console.error("Error al eliminar documentos:", error);
    }
  });

  it("Create cart", async function () {
    let response = await requester.post("/api/carts");
    let { ok, status, body } = response;
    expect(body.msg).to.be.equal("Carrito creado");
    expect(body.carrito).to.have.property("_id");
    expect(Array.isArray(body.carrito.products)).to.be.true;
    expect(status).to.be.equal(200);
    expect(ok).to.be.true;
    await cartModel.findByIdAndDelete(body.carrito._id);
  });

  it("Get cart by id", async function () {
    let cart = await requester.post("/api/carts");
    let cid = cart._body.carrito._id;
    let response = await requester.get(`/api/carts/${cid}`);
    let { ok, status, body } = response;
    expect(body.carrito).to.have.property("_id");
    expect(Array.isArray(body.carrito.products)).to.be.true;
    expect(status).to.be.equal(200);
    expect(ok).to.be.true;
    expect(isValidObjectId(cid)).to.be.true;
    await cartModel.findByIdAndDelete(cid);
  });

  it("Add product to cart", async function () {
    await requester.post("/login").send(premium);
    let cart = await requester.post("/api/carts");
    let cid = cart._body.carrito._id;
    let product = await productoModel.create(mockProduct);
    let pid = product._id;
    let response = await requester.post(`/api/carts/${cid}/product/${pid}`);
    let { ok, status, body } = response;
    expect(body.carrito).to.have.property("_id");
    expect(Array.isArray(body.carrito.products)).to.be.true;
    expect(status).to.be.equal(200);
    expect(ok).to.be.true;
    expect(isValidObjectId(pid)).to.be.true;
    expect(isValidObjectId(cid)).to.be.true;
    await productoModel.findByIdAndDelete(pid);
    await cartModel.findByIdAndDelete(cid);
  });

  it("Delete product in cart", async function () {
    let cart = await requester.post("/api/carts");
    let cid = cart._body.carrito._id;
    let product = await productoModel.create(mockProduct);
    let pid = product._id;
    await requester.post(`/api/carts/${cid}/product/${pid}`);
    let response = await requester.delete(`/api/carts/${cid}/product/${pid}`);
    let { ok, status, body } = response;
    expect(body.msg).to.be.equal(`Producto eliminado del carrito`);
    expect(status).to.be.equal(200);
    expect(ok).to.be.true;
    expect(isValidObjectId(pid)).to.be.true;
    expect(isValidObjectId(cid)).to.be.true;
    await productoModel.findByIdAndDelete(pid);
    await cartModel.findByIdAndDelete(cid);
  });

  it("Delete all products in cart", async function () {
    let cart = await requester.post("/api/carts");
    let cid = cart._body.carrito._id;
    let product = await productoModel.create(mockProduct);
    let pid = product._id;
    await requester.post(`/api/carts/${cid}/product/${pid}`);
    let response = await requester.delete(`/api/carts/${cid}`);
    let { ok, status, body } = response;
    expect(body.msg).to.be.equal(`Producto actualizado`);
    expect(status).to.be.equal(200);
    expect(ok).to.be.true;
    expect(isValidObjectId(pid)).to.be.true;
    expect(isValidObjectId(cid)).to.be.true;
    await productoModel.findByIdAndDelete(pid);
    await cartModel.findByIdAndDelete(cid);
  });

  it("Update one product in cart", async function () {
    let cart = await requester.post("/api/carts");
    let cid = cart._body.carrito._id;
    let product = await productoModel.create(mockProduct);
    let pid = product._id;
    let cartWithProduct = await requester.post(
      `/api/carts/${cid}/product/${pid}`
    );
    let response = await requester
      .put(`/api/carts/${cid}/product/${pid}`)
      .send({ quantity: 123 });
    let { ok, status, body } = response;

    expect(body.msg).to.be.equal(`Producto actualizado`);
    expect(status).to.be.equal(200);
    expect(ok).to.be.true;
    await productoModel.findByIdAndDelete(pid);
    await cartModel.findByIdAndDelete(cid);
  });

  it("Update all products in cart", async function () {
    let cart = await requester.post("/api/carts");
    let cid = cart._body.carrito._id;
    let product = await productoModel.create(mockProduct);
    let pid = product._id;
    let cartWithProduct = await requester.post(
      `/api/carts/${cid}/product/${pid}`
    );
    let response = await requester
      .put(`/api/carts/${cid}/product/${pid}`)
      .send({
        product: { _id: "667f6fd2c592ef6f5f7b5270" },
        quantity: 10,
      });
    let { ok, status, body } = response;

    expect(body.msg).to.be.equal(`Producto actualizado`);

    expect(body.carrito.products[0]).to.have.property("id");
    expect(isValidObjectId(body.carrito.products[0].id)).to.be.true;
    expect(status).to.be.equal(200);
    expect(ok).to.be.true;
    expect(isValidObjectId(pid)).to.be.true;
    expect(isValidObjectId(cid)).to.be.true;
    await productoModel.findByIdAndDelete(pid);
    await cartModel.findByIdAndDelete(cid);
  });
});
