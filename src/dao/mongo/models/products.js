import { Schema, model } from "mongoose";

const nameCollection = "Producto";

const ProductoSchema = new Schema({
  title: {
    type: String,
    required: [true, "El titulo del producto es obligatorio"],
  },
  description: {
    type: String,
    required: [true, "La descripcion del producto es obligatorio"],
  },
  price: {
    type: Number,
    required: [true, "El precio del producto es obligatorio"],
  },
  thumbnail: [{
    type: String,
  }],
  code: {
    type: String,
    required: [true, "El codigo del producto es obligatorio"],
    unique: true,
  },
  stock: {
    type: Number,
    required: [true, "La cantidad de stock del producto es obligatorio"],
  },
  status: {
    type: Boolean,
    default: true,
  },
  category: {
    type: String,
    required: [true, "La categoria del producto es obligatorio"],
  },
});

ProductoSchema.set("toJSON", {
  transform: function(doc,ret){
    delete ret.__v;
    return ret
  }
})

export const productoModel = model(nameCollection, ProductoSchema);