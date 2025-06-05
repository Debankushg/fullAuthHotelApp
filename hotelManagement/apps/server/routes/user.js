const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail", // Or use your SMTP provider here
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
  tls: {
    rejectUnauthorized: false, // Disable TLS certificate validation
  },
});

// OTP generation function
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
}

function sendOTPEmail(toEmail, otp) {
  const mailOptions = {
    from: `Radhakrishna Hotel <${process.env.EMAIL_USER}>`,
    to: toEmail, // Recipient's email
    subject: "Your OTP for Registration",
    text: `Your OTP for registration is: ${otp}`, // OTP message
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

// REGISTER USER
router.post("/register", async (req, res) => {
  try {
    const data = req.body;
    const otp = generateOTP(); // Generate OTP

    sendOTPEmail(data.email, otp);
    const otpExpiration = Date.now() + 5 * 60 * 1000; // OTP expiration time (5 minutes)

    req.session.otp = otp;
    req.session.otpExpiration = otpExpiration;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    data.password = hashedPassword;

    let token = jwt.sign({ email: data.email }, "secret");

    res.cookie("token", token, {
      httpOnly: false, // Ensures the cookie is not accessible via JavaScript
      secure: true, // Set to false in development (non-HTTPS)
      sameSite: "None", // Helps prevent cross-site request issues
      maxAge: 24 * 60 * 60 * 1000, // Optional: cookie expiration (24 hours)
    });
    const userObject = {
      username: data.username,
      email: data.email,
      type: data.type,
      // Add other fields as needed
    };

    // Serialize the user object into a JSON string
    const userString = JSON.stringify(userObject);
    res.cookie("user", userString, {
      httpOnly: false, // Allow JavaScript access to this cookie
      secure: true, // Use `secure: true` for HTTPS
      sameSite: "None", // Prevent cross-site request issues
      maxAge: 24 * 60 * 60 * 1000, // Cookie expiration (24 hours)
    });

    const user = new userModel(data);
    await user.save();

    res.status(201).json({
      status: "success",
      message: "Otp sent successfully to your email",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// VERIFY OTP
router.post("/verify-otp", async (req, res) => {
  const { otp } = req.body;
  const storedOtp = req.session.otp;
  const otpExpiration = req.session.otpExpiration;

  // Check if the OTP is valid and not expired
  if (!storedOtp || Date.now() > otpExpiration) {
    return res
      .status(400)
      .json({ status: "error", message: "OTP expired or invalid!" });
  }

  // Compare OTP values
  if (otp === storedOtp) {
    res
      .status(200)
      .json({ status: "success", message: "OTP verified successfully!" });
  } else {
    res.status(400).json({ status: "error", message: "Invalid OTP!" });
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password, type } = req.body;

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

    const userObject = {
      username: user.username,
      email: user.email,
      type: user.type,
      // Add other fields as needed
    };

    // Serialize the user object into a JSON string
    const userString = JSON.stringify(userObject);

    res.cookie("token", token, {
      httpOnly: false, // Ensures the cookie is not accessible via JavaScript
      secure: true, // Set to false in development (non-HTTPS)
      sameSite: "None", // Helps prevent cross-site request issues
      maxAge: 24 * 60 * 60 * 1000, // Optional: cookie expiration (24 hours)
    });

    res.cookie("user", userString, {
      httpOnly: false, // Allow JavaScript access to this cookie
      secure: true, // Use `secure: true` for HTTPS
      sameSite: "None", // Prevent cross-site request issues
      maxAge: 24 * 60 * 60 * 1000, // Cookie expiration (24 hours)
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
  res.clearCookie("user", "");
  res
    .status(200)
    .json({ status: "success", message: "User logged out successfully" });
});

module.exports = router;
