const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: [true, "Please add a unique username"] },
  password: { type: String, required: [true, "Please add a valid password."] },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }]
});

const User = mongoose.model("User", userSchema);
module.exports = User;