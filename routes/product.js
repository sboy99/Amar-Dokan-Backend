const express = require("express");
const router = express.Router();
const path = require("path");

const multer = require("multer");
const upload = multer({
  preservePath: true,
  dest: path.resolve(__dirname, "../tmp/"),
});

//> Validation Schemas <//
const {
  productValidationSchema,
  paramsValidationSchema,
} = require("../model/validation");

//> Middleware <//
const { validateData, validateParams } = require("../middleware/validate");
const {
  authintication,
  hasPermission,
} = require("../middleware/authintication");
const multerUploadImage = require("../middleware/milterUploadImage"); // ? fn(fieldName,maxAllowedFileSize,CloudinaryDestinationFolderPath)

//> Controls <//
const {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  deleteProductImage,
} = require("../controllers/product");

//> Routers <//
router
  .route("/")
  .get(getAllProducts)
  .post(
    authintication,
    hasPermission("admin"),
    validateData(productValidationSchema),
    createProduct
  );

router
  .route("/upload-image")
  .post(
    authintication,
    hasPermission("admin"),
    upload.single("image"),
    multerUploadImage("image", 2, "Amar-Dokan-Test/Products"),
    uploadProductImage
  )
  .delete(authintication, hasPermission("admin"), deleteProductImage);

router
  .route("/:id")
  .get(validateParams(paramsValidationSchema), getSingleProduct)
  .patch(
    authintication,
    hasPermission("admin"),
    validateParams(paramsValidationSchema),
    // multerUpload("image", "/Product", 1),
    // uploadProductImage,
    validateData(productValidationSchema),
    updateProduct
  )
  .delete(
    authintication,
    hasPermission("admin"),
    validateParams(paramsValidationSchema),
    deleteProduct
  );

module.exports = router;
