const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  type: {
    type: String,
    enum: ["employee", "customer"],
    default: "customer",
  },
});

module.exports = mongoose.model("user", userSchema);
