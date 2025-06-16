const express = require("express");
const multer = require("multer");
const router = express.Router();
const Rooms = require("../models/roomModel");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./photos");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype))
      cb(null, true);
    else cb(new Error("Only jpg, jpeg, png files are allowed"));
  },
});

router.post("/api/upload-product", upload.single("image"), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Create new product document
    const newProduct = new Rooms({
      name: req.body.name,
      image: `/uploads/${req.file.filename}`, // Store the relative path of the uploaded file
      price: req.body.price,
      ratings: req.body.ratings,
    });

    // Save to database
    await newProduct.save();

    res
      .status(201)
      .json({ message: "Product uploaded successfully", product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
