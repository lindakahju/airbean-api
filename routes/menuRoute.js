const express = require("express");
const router = express.Router();
const Menu = require("../models/menu");

router.get("/api/beans", async (req, res) => {
  try {
    let menu = await Menu.findOne({});
    if (!menu) {
      const data = require("../data/menu.json");
      menu = await Menu.create({ products: data });
    }

    res.json({ menu });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Menu items not found, check your connection." });
  }
});

module.exports = router;
