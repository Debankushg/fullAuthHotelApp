const express = require("express");
const multer = require("multer");
const router = express.Router();
const Rooms = require("../models/roomModel");
const Booking = require("../models/bookingModel");

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

router.get("/dashboard", async (req, res) => {
  try {
    const bookings = await Booking.aggregate([
      {
        $lookup: {
          from: "rooms", // Join the Rooms collection
          localField: "roomType", // Room type in Booking schema
          foreignField: "_id", // Match by the _id field in Rooms
          as: "roomDetails", // Alias for joined data
        },
      },
      {
        $lookup: {
          from: "payments", // Join the Payment collection
          localField: "userId", // UserId in Booking schema
          foreignField: "userId", // Match by userId in Payment collection
          as: "paymentDetails", // Alias for joined data
        },
      },
      {
        $unwind: {
          path: "$roomDetails", // Unwind roomDetails array
          preserveNullAndEmptyArrays: true, // Retain bookings even without matching rooms
        },
      },
      {
        $unwind: {
          path: "$paymentDetails", // Unwind paymentDetails array
          preserveNullAndEmptyArrays: true, // Retain bookings even without payments
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          phoneNo: 1,
          address: 1,
          status: 1,
          roomType: 1,
          roomCount: 1,
          personCount: 1,
          paymentAmount: "$paymentDetails.amount",
        },
      },
      {
        $group: {
          _id: "$_id", // Group by the unique booking _id to keep individual bookings
          name: { $first: "$name" },
          email: { $first: "$email" },
          phoneNo: { $first: "$phoneNo" },
          address: { $first: "$address" },
          status: { $first: "$status" },
          roomType: { $first: "$roomType" },
          roomCount: { $sum: "$roomCount" }, // Sum of room counts for this booking
          personCount: { $sum: "$personCount" }, // Sum of person counts for this booking
          totalAmountBooked: { $sum: "$paymentAmount" }, // Sum of payment amounts for this booking
        },
      },
    ]);

    if (!bookings || bookings.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No bookings found.",
        totalAmountBooked: 0,
        totalRoomBooked: 0,
        totalPersonCount: 0,
        bookings: [],
      });
    }

    // Calculate the totals after fetching all bookings
    const totalAmountBooked = bookings.reduce(
      (acc, booking) => acc + booking.totalAmountBooked,
      0
    );
    const totalRoomBooked = bookings.reduce(
      (acc, booking) => acc + booking.roomCount,
      0
    );
    const totalPersonCount = bookings.reduce(
      (acc, booking) => acc + booking.personCount,
      0
    );

    return res.status(200).json({
      status: "success",
      totalAmountBooked,
      totalRoomBooked,
      totalPersonCount,
      bookings,
    });
  } catch (error) {
    console.error("Error while fetching bookings:", error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching bookings.",
    });
  }
});

module.exports = router;
