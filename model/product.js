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

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    images: {
      type: [
        {
          id: {
            type: String,
            default: ``,
          },
          url: {
            type: String,
            required: true,
          },
        },
      ],
      required: [true, `Please provide image of the product`],
    },
    description: {
      type: String,
      trim: true,
      required: true,
      minlength: 256,
    },
    type: {
      type: String,
      required: true,
      enum: {
        values: validCategoryTypes,
        message: `Please provide a valid type`,
      },
    },
    category: {
      type: mongoose.Types.ObjectId,
      required: [true, `Please select a category for the product`],
      ref: "Category",
    },
    subCategories: [
      {
        type: String,
        minlength: [2, `Minimum 2 characters`],
        maxlength: [30, `Maximum 30 characters`],
      },
    ],
    freeShipping: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: false,
    },
    averageReviews: {
      type: Number,
      default: 0,
    },
    noOfReviews: {
      type: Number,
      default: 0,
    },
    inventory: {
      type: Number,
      default: 10,
      min: [1, `Stock size must be atleast 1`],
    },
    creatorId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { validateBeforeSave: true, timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
