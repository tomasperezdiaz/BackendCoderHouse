import express from "express";
import { Server, Socket } from "socket.io";
import { engine } from "express-handlebars";
import 'dotenv/config';
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";

import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import sessionsRouter from "./routers/sessions.router.js"
import views from "./routers/views.js";
import __dirname from "./utils.js";
import { dbConecction } from "./dataBase/config.js";
import { messageModel } from "./dao/mongo/models/messages.js";
import { initialPassport } from "./config/passport.js";
import { ProductRepository } from "./repositories/index.js";


const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        process.env.URI_MONGO_DB,
      ttl: 3600,
    }),
    secret: "StrikeOne",
    resave: true,
    saveUninitialized: true,
  })
);

initialPassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use("/", views);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", sessionsRouter)

await dbConecction();

const expressServer = app.listen(PORT, () => {
  console.log(`Corriendo aplicacion en el puerto ${PORT}`);
});
const io = new Server(expressServer);

io.on("connection", async (socket) => {
  const limit = 100;
  const { payload } = await ProductRepository.getProducts({ limit });
  const product = payload;
  socket.emit("product", payload);

  socket.on("agregarProducto", async (products) => {
    const newProduct = await ProductRepository.addProduct({ ...products });
    console.log({ products });
    if (newProduct) {
      product.push(newProduct);
      socket.emit("product", product);
    }
  });

  const messages = await messageModel.find();
  socket.emit("message", messages);

  socket.on("message", async (data) => {
    const newMessage = await messageModel.create({ ...data });
    if (newMessage) {
      const messages = await messageModel.find();
      io.emit("messageLogs", messages);
    }
  });

  socket.broadcast.emit("nuevo_user");
});
