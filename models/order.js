const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    cart: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Menu",
          required: true
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true, default: 0 }
      }
    ],
    time: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    deliveryTime: {
      type: String
    },
    status: { type: String, enum: ["pending", "delivered"], default: "pending" }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;