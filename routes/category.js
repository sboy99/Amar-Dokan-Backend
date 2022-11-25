const router = require("express").Router();
const { validateData, validateParams } = require("../middleware/validate");
const {
  paramsValidationSchema,
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
} = require("../model/validation");
const {
  getAllCategory,
  getSingleCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");

const {
  authintication,
  hasPermission,
} = require("../middleware/authintication");

router
  .route("/")
  .get(getAllCategory)
  .post(
    authintication,
    hasPermission("admin"),
    validateData(createCategoryValidationSchema),
    createCategory
  );
router
  .route("/:id")
  .get(
    authintication,
    hasPermission("admin"),
    validateParams(paramsValidationSchema),
    getSingleCategory
  )
  .patch(
    authintication,
    hasPermission("admin"),
    validateParams(paramsValidationSchema),
    validateData(updateCategoryValidationSchema),
    updateCategory
  )
  .delete(
    authintication,
    hasPermission("admin"),
    validateParams(paramsValidationSchema),
    deleteCategory
  );

module.exports = router;
