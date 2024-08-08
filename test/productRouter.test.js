import { isValidObjectId, mongoose } from "mongoose";
import { after, afterEach, before, describe, it } from "mocha";
import supertest from "supertest-session";
import { expect } from "chai";
import { fakerEN_US as faker } from "@faker-js/faker";

const requester = supertest("http://localhost:8080");

let mockProduct = {
  title: "test",
  description: "Prueba de producto",
  code: faker.string.alphanumeric(10),
  price: faker.commerce.price({ min: 10, max: 5000 }),
  status: true,
  stock: faker.number.int({ min: 1, max: 100 }),
  category: faker.commerce.productAdjective(),
  thumbnails: [faker.image.url()],
};
let user = { email: "admin@gmail.com", password: "admin" };
const premium = {
  email: "premium@gmail.com",
  password: "premium",
};
mongoose.set("bufferCommands", false);
mongoose.set("bufferTimeoutMS", 30000);

describe("Prueba de la ruta de productos", function () {
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
        .collection("productos")
        .deleteMany({ title: "test" });
    } catch (error) {
      console.error("Error al eliminar documentos:", error);
    }
  });

  it("Lista de todos los productos", async function () {
    let response = await requester.get("/api/products");
    let { ok, status, body } = response;

    expect(body).to.have.property("result");
    expect(body.result).to.have.property("payload");
    expect(Array.isArray(body.result.payload)).to.be.true;
    expect(status).to.be.equal(200);
    expect(ok).to.be.true;
  });

  it("Trae un producto segun el id que se mande", async function () {
    let productRes = await requester.post("/api/products").send(mockProduct);

    let pid = productRes._body.producto._id;
    let response = await requester.get(`/api/products/${pid}`);
    let { ok, status, body } = response;

    expect(isValidObjectId(body.producto._id)).to.be.exist;
    expect(status).to.be.equal(200);
    expect(ok).to.be.true;
  });

  it("Se agrega un producto a la DB", async function () {
    let response = await requester.post("/api/products").send(mockProduct);
    let { ok, status, body } = response;

    expect(body.producto).to.have.property("_id");
    expect(isValidObjectId(body.producto._id)).to.be.true;
    expect(status).to.be.equal(200);
    expect(ok).to.be.true;
  });

  it("Se actualiza un producto", async function () {
    let productRes = await requester.post("/api/products").send(mockProduct);
    let pid = productRes.body.producto._id;
    let response = await requester
      .put(`/api/products/${pid}`)
      .send({ stock: 100 });
    let { ok, status, body } = response;
    expect(isValidObjectId(body.producto._id)).to.be.true;
    expect(status).to.be.equal(200);
    expect(ok).to.be.true;
    expect(body.producto.stock).not.to.be.equal(productRes.body.producto.stock);
  });

  it("Se borra un producto", async function () {
    let productRes = await requester.post("/api/products").send(mockProduct);
    let id = productRes.body.producto._id;
    let response = await requester.delete(`/api/products/${id}`);
    let { ok, status, body } = response;
    expect(isValidObjectId(id)).to.be.true;
    expect(status).to.be.equal(200);
    expect(ok).to.be.true;
    expect(body.msg).to.be.equal(`Producto eliminado`);
  });
});
