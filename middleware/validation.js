const { User } = require("../models/dataModel");

const authValidation = (req, res, next) => {
  const {password, username } = req.body;

  if (!password || !username) {
    return res
      .status(400)
      .json({ error: "Email/password field are required!" });
  }
  next();
};

const userOrderValidation = (req, res, next) => {
  const { userId, guestEmail } = req.body;

  if (userId) {
    User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(400).json({ error: "userId is required." });
        }
        req.user = user;
        next();
      })
      .catch((error) => {
        console.error(error);
      });
  } else if (guestEmail) {
    next();
  } else {
    return res.status(400).json({ error: "guestEmail field is required." });
  }
};

const orderPropertyValidation = (req, res, next) => {
  const { cart } = req.body;

  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: "cart array is required" });
  }

  for (const item of cart) {
    if (!item.id || typeof item.id !== "string") {
      return res.status(400).json({ error: "enter a valid id" });
    }

    if (
      !item.quantity ||
      typeof item.quantity !== "number" ||
      item.quantity <= 0
    ) {
      return res
        .status(400)
        .json({ error: "quantity must be of type number and higher than 0" });
    }
  }
  next();
};

const checkId = (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "id field is required." });
  }

  next();
};


module.exports = {
  authValidation,
  userOrderValidation,
  orderPropertyValidation,
  checkId
};
