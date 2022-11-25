const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    refreshToken: {
      type: String,
      required: true,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    ip: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: `User`,
      required: true,
    },
  },
  { timestamps: true, validateBeforeSave: true }
);

module.exports = mongoose.model("Token", tokenSchema);
