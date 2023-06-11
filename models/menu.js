const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

const menuSchema = new mongoose.Schema({
  products: [productSchema],
  campaigns: [{
    product1: {
      type: String, // Change the type to String
      required: true
    },
    product2: {
      type: String, // Change the type to String
      required: true
    },
    offer: {
      type: Number,
      required: true
    }
  }]
});



const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
