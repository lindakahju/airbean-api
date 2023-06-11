const express = require("express");
const router = express.Router();
const Menu = require("../models/menu");
const { adminAuth } = require("../routes/adminAuthRoute");

const moment = require("moment");
require("moment-timezone");

// add new products to the menu (token required)
router.post("/api/products", adminAuth, async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
      throw new Error("Name, description, and price are required.");
    }

    let menu = await Menu.findOne({});

    if (!menu) {
      const data = require("../data/menu.json");
      menu = await Menu.create({ products: data });
    }

    const currentTime = moment().local();
    const newProductCreated = moment(currentTime).format("LLLL");

    const existingProduct = menu.products.find(
      (product) => product.name === name
    );

    if (existingProduct) {
      throw new Error("This product already exists in the menu.");
    }

    const newProduct = {
      name,
      description,
      price,
      createdAt: newProductCreated,
    };

    menu.products.push(newProduct);

    await menu.save();

    res
      .status(201)
      .json({ message: "Product added to the menu", product: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// modify exisiting product in the menu (token required)
router.put("/api/products/:productId", adminAuth, async (req, res) => {
  try {
    const productId = req.params.productId;
    const { name, description, price } = req.body;

    let menu = await Menu.findOne({});

    if (!menu) {
      const data = require("../data/menu.json");
      menu = await Menu.create({ products: data });
    }

    const currentTime = moment().local();
    const modifiedProduct = menu.products.find(
      (product) => product._id.toString() === productId
    );

    if (!modifiedProduct) {
      throw new Error("Coffee not found.");
    }

    let changesMade = false;

    if (name && name !== modifiedProduct.name) {
      modifiedProduct.name = name;
      changesMade = true;
    }
    if (description && description !== modifiedProduct.description) {
      modifiedProduct.description = description;
      changesMade = true;
    }
    if (price && price !== modifiedProduct.price) {
      modifiedProduct.price = price;
      changesMade = true;
    }

    if (!changesMade) {
      const noChangesMessage = "No changes were made.";
      res.status(400).json({ message: noChangesMessage });
      return;
    }

    await menu.save();

    const successMessage = "Product updated successfully.";
    res.json({ message: successMessage, product: modifiedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// delete product from the menu (token required)
router.delete("/api/products/:productId", adminAuth, async (req, res) => {
  try {
    const productId = req.params.productId;

    let menu = await Menu.findOne({});

    if (!menu) {
      const data = require("../data/menu.json");
      menu = await Menu.create({ products: data });
    }

    const productIndex = menu.products.findIndex(
      (product) => product._id.toString() === productId
    );

    if (productIndex === -1) {
      throw new Error("Coffee not found.");
    }

    const deletedProduct = menu.products.splice(productIndex, 1)[0];

    await menu.save();

    const successMessage = "Product deleted successfully.";
    res.json({ message: successMessage, product: deletedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// add a campaign to the menu (token required)
router.post("/api/campaign", adminAuth, async (req, res) => {
  try {
    const { product1, product2, offer } = req.body;

    const menu = await Menu.findOne({});
    if (!menu) {
      throw new Error("Menu not found.");
    }

    const existingProduct1 = menu.products.find(
      (product) => product.name === product1
    );
    const existingProduct2 = menu.products.find(
      (product) => product.name === product2
    );

    if (!existingProduct1) {
      throw new Error(`Product "${product1}" not found in the menu.`);
    }

    if (!existingProduct2) {
      throw new Error(`Product "${product2}" not found in the menu.`);
    }

    const existingCampaign = menu.campaigns.find(
      (campaign) =>
        campaign.product1 === existingProduct1.name &&
        campaign.product2 === existingProduct2.name
    );

    if (existingCampaign) {
      throw new Error(
        `Campaign with products "${product1}" and "${product2}" already exists.`
      );
    }

    const campaign = {
      product1: existingProduct1.name,
      product2: existingProduct2.name,
      offer: offer,
    };

    menu.campaigns.push(campaign);

    await menu.save();

    const confirmationMessage = `Campaign created. Products: ${existingProduct1.name} and ${existingProduct2.name}. Offer: ${offer}`;
    res.status(201).json({ message: confirmationMessage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// delete a campaign from the menu (token required)
router.delete("/api/campaign/:campaignId", adminAuth, async (req, res) => {
  try {
    const campaignId = req.params.campaignId;

    let menu = await Menu.findOne({});

    if (!menu) {
      const data = require("../data/menu.json");
      menu = await Menu.create({ products: data });
    }

    const campaignIndex = menu.campaigns.findIndex(
      (campaign) => campaign._id.toString() === campaignId
    );

    if (campaignIndex === -1) {
      throw new Error("Campaign not found.");
    }

    const deletedCampaign = menu.campaigns.splice(campaignIndex, 1)[0];

    await menu.save();

    const successMessage = "Campaign deleted successfully.";
    res.json({ message: successMessage, campaign: deletedCampaign });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
