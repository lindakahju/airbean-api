const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

let admin = {
  username: "Admin",
  password: "$2b$10$VXt.5qwHBk7P/DCUqg1xyuSn7AzNM3HpdjwR2haRpyKUwL9ZlnuOu", // bcrypt-hashed password
  role: "admin",
};

// admin authentication
function adminAuth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ success: false, error: "Access denied" });
  }

  try {
    const data = jwt.verify(token.replace("Bearer ", ""), "a1b1c1");
    req.username = data.username;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: "Access denied" });
  }
}

// register admin account
router.post("/api/admin/register", (req, res) => {
  const body = req.body;

  if (admin && admin.username === body.username) {
    return res
      .status(400)
      .json({ success: false, error: "Admin account already exists" });
  }

  bcrypt.hash(body.password, 10, (err, hashedPassword) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, error: "Error hashing password" });
    }

    admin = {
      username: body.username,
      password: hashedPassword,
      role: "admin",
    };

    res.json({ success: true, message: "Admin account created successfully" });
  });
});

// login as admin
router.post("/api/admin/login", (req, res) => {
  const body = req.body;

  if (!admin || admin.username !== body.username) {
    return res
      .status(401)
      .json({ success: false, error: "Invalid username or password" });
  }

  bcrypt.compare(body.password, admin.password, (err, result) => {
    if (err || !result) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid username or password" });
    }

    const token = jwt.sign({ username: admin.username }, "a1b1c1", {
      expiresIn: 600,
    });

    res.json({ success: true, token: token });
  });
});

module.exports = { adminAuth, router };
