const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: function () {
      return !this.mobile;
    },
    unique: true,
    sparse: true,
    lowercase: true,
    validate: [validator.isEmail, "Invalid email address"],
  },
  mobile: {
    type: String,
    required: function () {
      return !this.email;
    },
    unique: true,
    sparse: true,
    validate: {
      validator: function (v) {
        return /^[6-9]\d{9}$/.test(v);
      },
      message: "Invalid mobile number",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
