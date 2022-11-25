const express = require("express");
const router = express.Router();

const {
  getAllUser,
  createUser,
  getSingleUser,
  updateUser,
  deteleUser,
  showMe,
} = require("../controllers/user");
const { authintication } = require("../middleware/authintication");
const { validateData } = require("../middleware/validate");
const { userValidationSchema } = require("../model/validation");
//todo: Authintication..
router
  .route("/")
  .get(getAllUser)
  .post(validateData(userValidationSchema), createUser);
router.route("/showMe").get(authintication, showMe);
router.route("/:id").get(getSingleUser).patch(updateUser).delete(deteleUser);

module.exports = router;
