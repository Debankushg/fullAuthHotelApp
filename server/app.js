const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const path = require("path");
const userAuth = require("./routes/user");
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:7800",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", userAuth);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
