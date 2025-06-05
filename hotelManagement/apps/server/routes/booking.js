const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bookingModel = require("../models/bookingModel");
const userModel = require("../models/userModel"); // Assuming userModel exists

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, "secret-key"); // Use your secret key
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

//POST API BOOKING

router.post("/booking-rooms", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }

    // Verify the token and get the user data
    const decoded = jwt.verify(token, "secret"); // Use your secret key here

    const user = await userModel.findOne({ email: decoded.email });
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    // Check if the user type is 'customer'
    if (user.type !== "customer") {
      return res.status(403).json({
        status: "error",
        message: "Booking can only be made by a customer",
      });
    }

    // Proceed with creating the booking
    const data = req.body;
    const booking = new bookingModel({
      ...data,
      userId: user._id, // Save the user's ID with the booking
    });
    await booking.save();

    res.status(201).json({
      status: "success",
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// GET API FOR Booking

router.get("/booking-rooms", async (req, res) => {
  try {
    const token = req.cookies.token; // Get the token from cookies
    if (!token) {
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }

    // Verify the token and get the user ID
    const decoded = verifyToken(token);
    const userId = decoded.userId; // Assuming `userId` is stored in the JWT token

    // Pagination and search parameters with default values
    const {
      limit = 10,
      offset = 0,
      search = "",
      status = "",
      roomType = "",
    } = req.query;

    // Convert limit and offset to numbers
    const limitNumber = Math.max(parseInt(limit), 1); // Ensure limit is at least 1
    const offsetNumber = Math.max(parseInt(offset), 0); // Ensure offset is at least 0

    // Build the search query, only add conditions that are provided
    let searchQuery = { userId }; // Start with the userId filter for authorization
    if (search) {
      searchQuery.roomType = { $regex: search, $options: "i" }; // Case-insensitive search for roomType
    }
    if (status) {
      searchQuery.status = status; // Filter by booking status if provided
    }
    if (roomType) {
      searchQuery.roomType = roomType; // Filter by room type if provided
    }

    // Fetch bookings based on the filters, with pagination
    const bookings = await bookingModel
      .find(searchQuery) // Apply search filters
      .skip(offsetNumber) // Pagination: skip the offset
      .limit(limitNumber) // Pagination: limit the results
      .populate("userId"); // Populate user data if needed

    // Get the total count of bookings for pagination
    const totalBookings = await bookingModel.countDocuments(searchQuery); // Count based on the filtered query

    res.status(200).json({
      status: "success",
      bookings,
      totalBookings, // Total number of bookings for pagination
      totalPages: Math.ceil(totalBookings / limitNumber), // Calculate total pages
      currentPage: Math.ceil(offsetNumber / limitNumber) + 1, // Current page based on offset
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

module.exports = router;
