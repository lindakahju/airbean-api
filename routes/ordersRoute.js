const express = require("express");
const router = express.Router();
const moment = require("moment");

const { Order, Menu } = require("../models/dataModel");
const {
  userOrderValidation,
  orderPropertyValidation
} = require("../middleware/validation");

router.post(
  "/api/beans/orders",
  userOrderValidation,
  orderPropertyValidation,
  async (req, res) => {
    const { userId, cart, guestEmail } = req.body;

    try {
      let user;
      let email;

      if (userId) {
        user = req.user;
        email = user.email;
      } else if (guestEmail) {
        email = guestEmail;
      }
      const drinks = cart.map((item) => item.id);
      const menu = await Menu.find({ _id: { $in: drinks } });
      if (menu.length !== drinks.length) {
        return res.status(400).json({
          error: "Coffee not found in menu"
        });
      }
      const cartItem = cart.map((item) => {
        const menuItem = menu.find(
          (coffee) => coffee._id.toString() === item.id
        );
        const price = menuItem.price * item.quantity;
        return {
          id: menuItem._id,
          quantity: item.quantity,
          price: price,
          name: menuItem.name
        };
      });
      const totalPrice = cartItem.reduce((acc, item) => acc + item.price, 0);
      const currentTime = moment().local();
      const timeToMakeOrderReady = 10;
      const ordersEstimatedDeliveryTime = moment(currentTime)
        .add(timeToMakeOrderReady, "minutes")
        .format("LLLL");

      const order = new Order({
        cart: cartItem,
        time: currentTime,
        user: userId || null,
        deliveryTime: ordersEstimatedDeliveryTime,
        status: "pending"
      });

      await order.save();

      if (user) {
        user.orders.push(order._id);
        await user.save();
      }

      const orderInfo = {
        customer: {
          email
        },

        "Order Details": { order, orderTotal: totalPrice }
      };
      res.json({
        orderInfo
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }
);

module.exports = router;