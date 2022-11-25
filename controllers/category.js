const err = require("../errors");
const Category = require("../model/category");
const { StatusCodes } = require("http-status-codes");

const getAllCategory = async (req, res) => {
  //> Implement queries so that user can search for specific items,sort and select fields
  const { name, type, sort, select } = req.query;
  const queryObj = {};
  // Insert attributes to query onject if they are defined in the query
  if (name) {
    queryObj.name = { $regex: name, $options: "i" };
  }
  if (type) {
    queryObj.type = { $regex: type, $options: "i" };
  }

  // Find All categories form DB that matches the query..
  // To implement sort and select later on, which go along with find I'm considering this approach
  const result = Category.find(queryObj);

  if (sort) {
    const sortList = sort.split(",").join(" ");
    result.sort(sortList);
  } else result.sort("name");

  if (select) {
    const selectList = select.split(",").join(" ");
    result.select(selectList);
  }

  // After implementing select and sort I'm waiting for the result;
  const categories = await result;
  res.status(StatusCodes.OK).json({ count: categories.length, categories });
};

//> Read Category
const getSingleCategory = async (req, res) => {
  const { id: categoryId } = req.params;
  if (!categoryId) throw new err.BAD_REQUEST(`Provide category Id`);

  const category = await Category.findOne({ _id: categoryId }).select("-__v");
  // if no category exist send not found error
  if (!category)
    throw new err.NOT_FOUND(`Category with Id:${categoryId} not found`);

  res.status(StatusCodes.OK).json(category);
};

//> Create Category
const createCategory = async (req, res) => {
  // Get Category name & adminId
  const { name } = req.body;
  const alreadyExist = await Category.findOne({ name });
  if (alreadyExist)
    throw new err.BAD_REQUEST(`${name} already exist in category`);

  const result = await Category.create({
    ...req.body,
    creatorId: req.user.userId,
  });

  const newCategory = {
    _id: result._id,
    name: result.name,
    type: result.type,
    subCategories: result.subCategories,
    published: result.published,
  };

  res.status(StatusCodes.CREATED).json(newCategory);
};

//> Update Category
const updateCategory = async (req, res) => {
  const { id: categoryId } = req.params;
  if (!categoryId) throw new err.BAD_REQUEST(`Provide category Id`);

  // Find for category that matches the CategoryId
  const category = await Category.findOne({ _id: categoryId });

  // If no category found send not found error
  if (!category)
    throw new err.NOT_FOUND(`Category with Id:${categoryId} not found`);

  // Grab the data from body and check for the availability and update it update the data..
  const { creatorId, _id, ...payload } = req.body; // remove creatorId, _id in case anybody wants to change it samartly
  for (let key in payload) {
    if (category[key]) {
      category[key] = payload[key];
    }
  }

  await category.save();
  res.status(StatusCodes.OK).json({ message: `Category Updated Successfully` });
};

//> Delete Category
const deleteCategory = async (req, res) => {
  //> Get Category Id from admin
  const { id: categoryId } = req.params;
  if (!categoryId) throw new err.BAD_REQUEST(`Provide category Id`);

  const category = await Category.findOne({
    _id: categoryId,
    creatorId: req.user.userId,
  });

  if (!category) throw new err.NOT_FOUND(`Category isn't found`);
  await category.delete();
  res.status(StatusCodes.OK).json({ message: `Category deleted successfully` });
};

module.exports = {
  getAllCategory,
  getSingleCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
