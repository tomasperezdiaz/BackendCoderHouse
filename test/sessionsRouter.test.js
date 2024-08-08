import { isValidObjectId, mongoose } from "mongoose";
import { afterEach, describe, it } from "mocha";
import supertest from "supertest-session";
import { expect } from "chai";
import { fakerEN_US as faker } from "@faker-js/faker";
import { userModel } from "../src/dao/mongo/models/user.js";

const requester = supertest("http://localhost:8080");
const password = faker.internet.password();

let mockRegister = {
  name: faker.person.firstName(),
  lastname: faker.person.lastName(),
  email: faker.internet.email(),
  age: faker.number.int({ min: 18, max: 50 }),
  password: password,
  confirmPassword: password,
  cart: faker.string.alphanumeric(10),
};

let user = { email: "admin@gmail.com", password: "admin" };


mongoose.set("bufferCommands", false);
mongoose.set("bufferTimeoutMS", 30000);

describe("Sessions router test", function () {
  this.timeout(100000);
  before(async function () {
    try {
      await mongoose.connect(
        "mongodb+srv://tomasperezdiaz03:789456123@database.dy0snpa.mongodb.net/ecommerce"
      );
    } catch (error) {
      console.error("Error during setup:", error);
    }
  });
  afterEach(async function () {
    await userModel.deleteMany({ name: mockRegister.name });
    await requester.get("/logout");
  });

  it("Register", async function () {
    let response = await requester.post("/register").send(mockRegister);
    let { ok, status, body } = response;

    expect(ok).to.be.true;
    expect(body.payload).to.be.equal(`Successful registration`);
    expect(status).to.be.equal(200);

    expect(isValidObjectId(body.newUser._id)).to.be.true;
  });

  it("Login", async function () {
    let response = await requester.post("/login").send(user);
    let { ok, status, body } = response;
    expect(status).to.be.equal(200);
    expect(ok).to.be.true;
    expect(body.payload).to.be.equal(`Successfull login`);
  });
});