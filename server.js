const express = require("express");
const mongoose = require("mongoose");

const {
  adminAuth, router: adminAuthRoute,
  } = require("./routes/adminAuthRoute");
const menuRoute = require("./routes/menuRoute.js");
const adminRoute = require("./routes/adminRoute.js");
const userAuthRoute = require("./routes/userAuthRoute.js");
const orderRoute = require("./routes/ordersRoute.js");
const userHistoryRoute = require("./routes/userHistoryRoute.js");

const app = express();
app.use(express.json());
app.use(
  menuRoute,
  adminRoute,
  userAuthRoute,
  orderRoute,
  userHistoryRoute,
  adminAuthRoute
);

const PORT = process.env.PORT || 8000;

const run = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://linda:pwd123@airbean.pgh6mhw.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("Connected to MongoDB");

    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

run();
