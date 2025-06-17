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

router.post("/upload-rooms", upload.single("image"), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Create new product document
    const newProduct = new Rooms({
      name: req.body.name,
      image: `http://localhost:3000/photos/${req.file.filename}`,
      price: req.body.price,
      ratings: req.body.ratings,
    });

    // Save to database
    await newProduct.save();

    res.status(201).json({
      status: "success",
      message: "Product uploaded successfully",
      product: newProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

router.get("/all-rooms", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    let query = {};

    // Check if search is a valid number and handle it accordingly
    if (!isNaN(search) && search.trim() !== "") {
      // If search is a valid number (for price search)
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } }, // Search in the `name` field
          { price: { $eq: parseFloat(search) } }, // Search for exact match on `price`
        ],
      };
    } else {
      // If search is not a number or empty, search only in the `name` field
      query = {
        $or: [{ name: { $regex: search, $options: "i" } }],
      };
    }

    const rooms = await Rooms.find(query).skip(skip).limit(limit);
    const totalRooms = await Rooms.countDocuments(query);

    res.status(200).json({
      status: "success",
      rooms,
      totalRooms,
      currentPage: page,
      totalPages: Math.ceil(totalRooms / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
