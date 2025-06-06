const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bookingModel = require("../models/bookingModel");
const userModels = require("../models/userModel"); // Assuming userModel exists

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, "secret"); // Use your secret key
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

    const user = await userModels.findOne({ email: decoded.email });
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

// GET API FOR Booking for each customer

router.get("/booking-rooms", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }

    // Verify the token and get the user ID
    const decoded = verifyToken(token);
    const userEmail = decoded.email;

    if (!userEmail) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid token" });
    }

    // Find the user by email
    const user = await userModels.findOne({ email: userEmail });

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    // Pagination and search parameters with default values
    const {
      limit = 1,
      offset = 0,
      search = "",
      status = "",
      roomType = "",
    } = req.query;

    // Convert limit and offset to numbers
    const limitNumber = Math.max(parseInt(limit), 1); // Ensure limit is at least 1
    const offsetNumber = Math.max(parseInt(offset), 0); // Ensure offset is at least 0

    // Build the search query, only add conditions that are provided
    let searchQuery = { userId: user._id }; // Start with the userId filter for authorization
    if (search) {
      searchQuery.roomType = { $regex: search, $options: "i" }; // Case-insensitive search for roomType
    }
    if (status) {
      searchQuery.status = status;
    }
    if (roomType) {
      searchQuery.roomType = roomType;
    }

    // Fetch bookings based on the filters, with pagination
    const bookings = await bookingModel
      .find(searchQuery)
      .skip(offsetNumber)
      .limit(limitNumber)
      .populate("userId")
      .lean();

    // Get the total count of bookings for pagination
    const totalBookings = await bookingModel.countDocuments(searchQuery); // Count based on the filtered query

    res.status(200).json({
      status: "success",
      bookings,
      totalBookings, // Total number of bookings for pagination
      totalPages: Math.ceil(totalBookings / limitNumber), // Calculate total pages
      currentPage: Math.ceil(offsetNumber / limitNumber) + 0, // Current page based on offset
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// GET API FOR ALL Bookings

router.get("/all-bookings", async (req, res) => {
  try {
    const { search, limit, offset } = req.query;

    // Convert limit and offset to numbers
    const limitNumber = Math.max(parseInt(limit), 1); // Ensure limit is at least 1
    const offsetNumber = Math.max(parseInt(offset), 0); // Ensure offset is at least 0

    // Build the search query
    let searchQuery = {};
    if (search) {
      // Search by roomType or name (you can adjust this based on your needs)
      searchQuery = {
        $or: [
          { roomType: { $regex: search, $options: "i" } }, // Search in roomType (case-insensitive)
          { name: { $regex: search, $options: "i" } }, // Search in name (case-insensitive)
        ],
      };
    }

    // Fetch the bookings based on the filters, with pagination
    const bookings = await bookingModel
      .find(searchQuery)
      .skip(offsetNumber)
      .limit(limitNumber)
      .lean();

    const totalBookings = await bookingModel.countDocuments(searchQuery);

    const totalPages = Math.ceil(totalBookings / limitNumber);

    res.status(200).json({
      status: "success",
      message: "Bookings fetched successfully",
      bookings,
      totalBookings, // Total number of bookings for pagination
      totalPages, // Total number of pages
      currentPage: Math.ceil(offsetNumber / limitNumber) + 1, // Current page
    });
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// CHange the status

router.patch("/update-booking-status", async (req, res) => {
  try {
    const { bookingId, newStatus } = req.body;

    // Validate that newStatus is either "Confirmed" or "Cancelled"
    if (!["Confirmed", "Cancelled"].includes(newStatus)) {
      return res.status(400).json({
        status: "error",
        message:
          "Invalid status value. It should be 'Confirmed' or 'Cancelled'.",
      });
    }

    // Find the booking by its ID
    const booking = await bookingModel.findById(bookingId);

    if (!booking) {
      return res
        .status(404)
        .json({ status: "error", message: "Booking not found" });
    }

    // Update the status of the booking
    booking.status = newStatus;

    // If status is "Confirmed", set isBooked to true
    if (newStatus === "Confirmed") {
      booking.isBooked = true;
    }

    // If status is "Cancelled", set isBooked to false
    if (newStatus === "Cancelled") {
      booking.isBooked = false;
    }

    // Save the updated booking
    await booking.save();

    // Return the updated booking
    res.status(200).json({
      status: "success",
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

module.exports = router;
