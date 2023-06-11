const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { User } = require("../models/dataModel");
const { Admin } = require("../models/dataModel")
const { authValidation } = require("../middleware/validation");

router.post("/api/user/signup", authValidation, async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/api/user/login", authValidation, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(403)
        .json({ error: "Username is wrong or does not exist" });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      return res.status(403).json({ error: "Password is wrong, try again" });
    }

    res.json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).res.json({ error: error.message });
  }
});


module.exports = router;