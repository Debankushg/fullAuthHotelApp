// models/Product.js
const mongoose = require("mongoose");

// Define the Product schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    ratings: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt

const Rooms = mongoose.model("Rooms", productSchema);

module.exports = Rooms;
