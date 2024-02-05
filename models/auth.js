const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  verificationCode: {
    type: String,
    required: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("auth", AuthSchema);
