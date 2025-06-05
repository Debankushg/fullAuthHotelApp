const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const data = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    data.password = hashedPassword;

    let token = jwt.sign({ email: data.email }, "secret");

    res.cookie("token", token, {
      httpOnly: true, // Ensures the cookie is not accessible via JavaScript
      secure: false, // Set to false in development (non-HTTPS)
      sameSite: "Strict", // Helps prevent cross-site request issues
      maxAge: 24 * 60 * 60 * 1000, // Optional: cookie expiration (24 hours)
    });

    const user = new userModel(data);
    await user.save();

    res
      .status(201)
      .json({ status: "success", message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid password" });
    }

    let token = jwt.sign({ email: user.email }, "secret");

    res.cookie("token", token, {
      httpOnly: true, // Ensures the cookie is not accessible via JavaScript
      secure: false, // Set to false in development (non-HTTPS)
      sameSite: "Strict", // Helps prevent cross-site request issues
      maxAge: 24 * 60 * 60 * 1000, // Optional: cookie expiration (24 hours)
    });

    res
      .status(200)
      .json({ status: "success", message: "User logged in successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token", "");
  res
    .status(200)
    .json({ status: "success", message: "User logged out successfully" });
});

module.exports = router;
