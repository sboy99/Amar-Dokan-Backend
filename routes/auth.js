const express = require("express");
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyMail,
  logout,
} = require("../controllers/auth");
const { authintication } = require("../middleware/authintication");

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyMail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.delete("/logout", authintication, logout);

module.exports = router;
