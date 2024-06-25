import mongoose from "mongoose";

export const dbConecction = async () => {
  try {
    await mongoose.connect(process.env.URI_MONGO_DB),
      console.log("base de datos online");
  } catch (error) {
    console.log("Error al levantar la base de datos");
    process.exit(1);
  }
};
