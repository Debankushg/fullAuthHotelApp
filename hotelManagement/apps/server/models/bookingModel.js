const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  roomType: {
    type: String,
    required: true,
  },
  roomCount: {
    type: Number,
    required: true,
    min: 1, // Minimum 1 room should be booked
  },
  personCount: {
    type: Number,
    required: true,
    min: 1, // Minimum 1 person should be booked
  },
  checkIn: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [/\S+@\S+\.\S+/, "Please use a valid email address"], // Email validation
  },
  phoneNo: {
    type: String,
    required: true,
    // match: [/^\d{10}$/, "Please provide a valid 10-digit phone number"], // Phone number validation (adjust as needed)
  },
  address: {
    type: String,
    required: true,
  },
  checkOut: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled"], // Define the possible statuses
    default: "Pending",
  },
  isBooked: {
    type: Boolean,
    default: false, // Ensure the field exists and defaults to false
  },
});

// Create a model based on the schema
module.exports = mongoose.model("Booking", bookingSchema);
