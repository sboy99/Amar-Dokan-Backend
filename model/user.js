const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const userSchemaPrev = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, `Name is required`],
      minlength: [3, `Name should be atleast 3 letters long`],
      maxlength: [30, `Name should be atmost 30 letters long `],
    },
    email: {
      type: String,
      trim: true,
      required: [true, `Email is required`],
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: `Please Provide a valid Email`,
      },
    },
    password: {
      type: String,
      required: [true, `Password is required`],
      minlength: [6, `Password must have to atleast 6 letters long`],
    },
    passwordToken: {
      type: String,
      default: null,
    },
    passwordTokenExpirationDate: {
      type: Date,
      default: null,
    },
    verificationToken: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: {
        values: ["owner", "admin", "user"],
        message: `Role does not match`,
      },
      default: `user`,
    },
    image: {
      type: String,
      default: `/public/defaults/defaultProfile.png`,
    },
  },
  { timestamps: true, validateBeforeSave: true }
);

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    required: [true, `Name is required`],
    minlength: [3, `Name should be atleast 3 letters long`],
    maxlength: [30, `Name should be atmost 30 letters long `],
  },
  email: {
    type: String,
    required: [true, `Email is required`],
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
    trim: true,
    unique: true,
  },
  role: {
    type: String,
    enum: {
      values: ["owner", "admin", "user"],
      message: `Role does not match`,
    },
    default: `user`,
  },
});

// userSchema.pre("save", async function () {
//   if (!this.isModified("password")) return;
//   const salt = await bcryptjs.genSalt(10);
//   this.password = await bcryptjs.hash(this.password, salt);
// });

// userSchema.methods.comparePassword = async function (userPassword) {
//   const isMatch = await bcryptjs.compare(userPassword, this.password);
//   return isMatch;
// };

// userSchema.methods.comparePasswordToken = async function (passwordToken) {
//   return (
//     this.passwordToken &&
//     this.passwordTokenExpirationDate > new Date(Date.now()) &&
//     bcryptjs.compare(this.passwordToken, passwordToken)
//   );
// };

module.exports = mongoose.model("User", userSchema);
