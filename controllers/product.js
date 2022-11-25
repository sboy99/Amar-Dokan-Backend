const err = require("../errors");
const Product = require("../model/product");
const cloudinary = require("cloudinary").v2;

//TODO > Pagination,Query,etc
const getAllProducts = async (req, res) => {
  const products = await Product.find({}).populate(
    "category",
    "name type subCategories"
  );
  res.status(200).json({ count: products.length, products });
};

//> Get Single Product by ID
const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) throw new err.NOT_FOUND(`No Item found with Id:${productId}`);
  res.status(200).json(product);
};

//> Create new product
const createProduct = async (req, res) => {
  console.log(req.body);
  const product = await Product.create({
    ...req.body,
    creatorId: req.user.userId,
  });
  res.status(200).json(product);
};

//> Update product image
const updateProduct = async (req, res) => {
  //retrive id from params
  const { id: productId } = req.params;
  //retrive image from body
  const { image, imagePublicId } = req.body;
  //search for the item in database
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    //if product not ofund but image is uploaded,destroy the image
    if (image) await cloudinary.uploader.destroy(imagePublicId);
    throw new err.NOT_FOUND(`No product found with id:${productId}`);
  }
  //if user updates image destroy previous image
  if (image) await cloudinary.uploader.destroy(product.imagePublicId);
  //update all provided details
  const modifiedProduct = await Product.findOneAndUpdate(
    { _id: productId },
    { ...req.body, creatorId: req.user.userId },
    { new: true }
  );
  //send successful response to user
  res.status(200).json(modifiedProduct);
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId }).select(
    "imagePublicId"
  );
  if (!product)
    throw new err.NOT_FOUND(`No product found with id:${productId}`);
  await cloudinary.uploader.destroy(product?.imagePublicId);
  product.remove();
  res.status(200).json({ message: `Product removed successfully` });
};

const bckuploadProductImage = async (req, res, next) => {
  req.body.image = req?.file?.path;
  req.body.imagePublicId = req?.file?.filename; // required for cloudnary image delete
  next();
};

const uploadProductImage = async (req, res) => {
  res.status(200).json(req.body.image);
};

const deleteProductImage = async (req, res) => {
  const { id } = req.query;
  console.log(id);
  await cloudinary.uploader.destroy(id);
  res.status(200).json({ message: `Image successfully deleted` });
};

module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  deleteProductImage,
};
