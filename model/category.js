const mongoose = require("mongoose");

const validCategoryTypes = [
  "Appliances",
  "Books",
  "Cloths",
  "Electronics",
  "Foods",
  "Furniture",
  "Grocery",
  "Health & Care",
  "Sports & Fitness",
  "Daily Essentials",
];

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, `Please enter category name`],
      minlength: [2, `Minimum 2 characters`],
      maxlength: [30, `Maximum 30 characters`],
      unique: true,
    },
    subCategories: [
      {
        type: String,
        minlength: [2, `Minimum 2 characters`],
        maxlength: [30, `Maximum 30 characters`],
        unique: [true, `Child category already exist`],
      },
    ],
    type: {
      type: String,
      enum: {
        values: validCategoryTypes,
        message: `Please provide a valid type`,
      },
      required: [true, `Please select a type`],
    },
    published: {
      type: Boolean,
      default: false,
    },
    creatorId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, `Creator id is required`],
    },
  },
  { validateBeforeSave: true, timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
