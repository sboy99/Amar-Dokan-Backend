const yup = require("yup");
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
// const err = require("../../errors");
const mongodbObjectId = /^[0-9a-fA-F]{24}$/;

const paramsValidationSchema = yup.object({
  id: yup.string().required().matches(mongodbObjectId, `invalid id`),
});

const productValidationSchema = yup.object({
  name: yup.string().required(`name shouldn't be empty`),
  price: yup
    .number()
    .required(`price should not be empty`)
    .min(0, `price can't be negetive`),
  image: yup
    .array(
      yup.object({
        id: yup.string().required(`Public id is required`),
        url: yup.string().required(`Image URL is required`),
      })
    )
    .min(5, `Minimum select atleast five images`)
    .max(8, `Maximum image limit is eight`),
  description: yup
    .string()
    .required(`please add some description`)
    .min(256, `description length sould be atleast 256`),
  inventory: yup
    .number()
    .required(`stock size is required`)
    .min(1, `stock size should be atleast 1`),
  type: yup
    .string()
    .required(`Please select a type`)
    .oneOf(validCategoryTypes, `Selected type didn't match existing types`),
  category: yup
    .string()
    .required(`please select a category`)
    .matches(mongodbObjectId, `provide a valid category`),
  subCategories: yup.array(
    yup
      .string()
      .min(2, `Child category should be atleast 2 letters long`)
      .max(30, `Child category should not be exceeded 30 characters`)
  ),
  freeShipping: yup.boolean(),
  published: yup.boolean(),
});

const userValidationSchema = yup.object({
  uid: yup.string().required("Please provide uid"),
  name: yup
    .string()
    .required("Name should not be empty")
    .min(3, "Name should be atleat 3 letters long")
    .max(30, "Maximum name limit exceeds"),
  email: yup
    .string()
    .email("Please provide a valid email")
    .required("Email shold not be empty"),
});

//> Category
const createCategoryValidationSchema = yup.object({
  name: yup
    .string()
    .required(`Please provide an appropiate category name`)
    .min(2, `Category name should be atleast 2 letters long`)
    .max(30, `Category name should not exist 30 characters`),
  subCategories: yup.array(
    yup
      .string()
      .min(2, `Child category should be atleast 2 letters long`)
      .max(30, `Child category should not be exceeded 30 characters`)
  ),
  type: yup
    .string()
    .required(`Please select a type`)
    .oneOf(validCategoryTypes, `Selected type didn't match existing types`),
  published: yup.boolean(),
});

const updateCategoryValidationSchema = yup.object({
  name: yup
    .string()
    .min(2, `Category name should be atleast 2 letters long`)
    .max(30, `Category name should not exist 30 characters`),
  subCategories: yup.array(
    yup
      .string()
      .min(2, `Child category should be atleast 2 letters long`)
      .max(30, `Child category should not be exceeded 30 characters`)
  ),
  type: yup
    .string()
    .oneOf(validCategoryTypes, `Selected type didn't match existing types`),
  published: yup.boolean(),
});

module.exports = {
  productValidationSchema,
  paramsValidationSchema,
  userValidationSchema,
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};
