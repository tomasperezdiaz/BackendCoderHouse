import mongoose from 'mongoose';

const nameCollection = "Ticket";

const TicketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    title: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    code: { type: String }
  }]
});

// Crear índice parcial en el campo products.code
TicketSchema.index(
  { "products.code": 1 },
  { unique: true, sparse: true } // Usar sparse: true para índice parcial
);

TicketSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export const ticketModel = mongoose.model(nameCollection, TicketSchema);
