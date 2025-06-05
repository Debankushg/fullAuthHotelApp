const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("path");
const userAuth = require("./routes/user"); // Ensure this is correct
const bookingRooms = require("./routes/booking"); // Ensure this is correct
const cors = require("cors");
const session = require("express-session");

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Use true if you have HTTPS setup
  })
);

const corsOptions = {
  origin: "http://localhost:7800",
  credentials: true, // Allow credentials to be sent
};

app.use(cors(corsOptions)); // CORS setup to allow cross-origin requests

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://localhost:27017/ecommerce")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define routes for user authentication and booking
app.use("/", userAuth);
app.use("/", bookingRooms);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
