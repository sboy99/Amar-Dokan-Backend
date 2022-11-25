const { StatusCodes: sts } = require("http-status-codes");
const User = require("../model/user");

//Show Me//
const showMe = async (req, res) => {
  res.status(sts.OK).json(req.user);
};

//Get ALL User//
const getAllUser = async (req, res) => {
  res.status(sts.OK).json({ message: `All User` });
};

//Create//
const createUser = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  //id no user found create an user account
  if (!user) {
    await User.create(req.body);
    //TODO: Create a new cart..
  }
  res.status(sts.CREATED).json({ message: `User Created` });
};

//Read//
const getSingleUser = async (req, res) => {
  res.status(sts.OK).json({ message: `Single User` });
};

//Update//
const updateUser = async (req, res) => {
  res.status(sts.OK).json({ message: `Update User` });
};

//Delete//
const deteleUser = async (req, res) => {
  res.status(sts.OK).json({ message: `Delete User` });
};

module.exports = {
  showMe,
  getAllUser,
  getSingleUser,
  createUser,
  updateUser,
  deteleUser,
};
