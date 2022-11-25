const err = require("../errors");
const Product = require("../model/product");
const cloudinary = require("cloudinary").v2;

//TODO > Pagination,Query,etc
const getAllProducts = async (req, res) => {
  const { select, sort, name, type, freeShipping, price, limit, page } =
    req.query;
  const queryObj = {};

  if (name) {
    queryObj.name = { $regex: name, $options: "i" };
  }
  if (type) {
    queryObj.type = { $regex: type, $options: "i" };
  }

  if (freeShipping === `true`) {
    queryObj.freeShipping = true;
  }

  // Pagination..
  const currentPage = parseInt(page) || 0;
  const productLimit = parseInt(limit) || 10;

  const payload = {}; // Data to send as a response
  payload.count = await Product.countDocuments().exec();

  const startIndex = currentPage * productLimit;
  const endIndex = (currentPage + 1) * productLimit;

  if (startIndex > 0) {
    payload.previous = {
      page: currentPage - 1,
      limit: productLimit,
    };
  }

  if (endIndex < payload.count) {
    payload.next = {
      page: currentPage + 1,
      limit: productLimit,
    };
  }

  const result = Product.find(queryObj).skip(startIndex).limit(productLimit);

  if (sort) {
    const sortList = sort.split(",").join(" ");
    result.sort(sortList);
  } else result.sort("name");

  if (select) {
    const selectList = select.split(",").join(" ");
    result.select(`${selectList} -__v -createdAt -updatedAt -creatorId`);
  } else result.select("-__v -createdAt -updatedAt -creatorId");

  const products = await result.populate("category", "name subCategories");
  payload.data = products;
  payload.limit = productLimit;

  res.status(200).json(payload);
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
