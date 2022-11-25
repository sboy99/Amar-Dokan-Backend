const { StatusCodes } = require("http-status-codes");
const User = require("../model/user");
const err = require("../errors");
const crypto = require("crypto");
const {
  createPayload,
  sendVerificationMail,
  getRefreshToken,
  encryptToken,
} = require("../utils");
const { isValid, attachCookiesToResponse } = require("../utils");
const Token = require("../model/token");
const sendResetPasswordMail = require("../utils/sendResetPasswordMail");
const { json } = require("express");

//Register User//
const register = async (req, res) => {
  const { name, email, password } = req.body;

  //> Check for all credentials
  if (!name || !email || !password)
    throw new err.BAD_REQUEST(`Please Provide all Credentials`);

  //> Check if user exist with this email
  if (await User.findOne({ email }))
    throw new err.BAD_REQUEST(`Another user exist with this email!`);

  //> Create Verification Token
  const verificationToken = await crypto.randomBytes(70).toString("hex");

  //> Create a user with all lowerletters hash password before save
  const user = await User.create({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password,
    verificationToken,
  });

  //> Send Verification Mail to user
  await sendVerificationMail(
    user.name,
    user.email,
    user.verificationToken,
    process.env.ORIGIN
  );
  res.status(200).json({
    message: `Verification mail has been sent to your Email Address. Please verify your Email`,
  });
};

//Verify Mail//
const verifyMail = async (req, res) => {
  const { token } = req.body;
  const payload = isValid(token);
  const user = await User.findOne({ email: payload?.email }).select(
    `name verificationToken _id isVerified`
  );
  //> check verification token
  if (!user || user.verificationToken !== payload.verificationToken)
    throw new err.UNAUTHORIZED(`Unauthorized to access`);

  user.verificationToken = null;
  user.isVerified = true;

  await user.save();

  res
    .status(200)
    .json({ message: `Thank You your email has been verified successfully` });
};

//log in//
const login = async (req, res) => {
  const { email, password } = req.body;
  //> check for mail or password if null send bad request
  if (!email || !password)
    throw new err.BAD_REQUEST(`Please Provide both email and password`);

  //> search for user through email
  const user = await User.findOne({ email }).select(
    "_id name role isVerified password"
  );

  //> if user not found send not found error
  if (!user) throw new err.NOT_FOUND(`User not found`);

  //> If not verified throw bad request (please verify your email)
  if (!user?.isVerified) throw new err.BAD_REQUEST(`Please verify your email`);

  //> Check if User is blocked
  const isActive = await Token.findOne({ user: user._id }).select("blocked");
  if (isActive && isActive?.blocked)
    throw new err.UNAUTHORIZED(`Access Forbidden!`);

  //> verify user password with orginal one if mismatch send invalid password
  if (!(await user.comparePassword(password)))
    throw new err.UNAUTHORIZED(`invalid password`);

  //> create refresh token
  const refreshToken = await getRefreshToken({ req, userId: user._id });
  //> attach signed cookies to response
  const userPayload = createPayload(user);
  attachCookiesToResponse({ res, user: userPayload, refreshToken });
  res.status(200).json({ user: userPayload });
};

//forgot password//
const forgotPassword = async (req, res) => {
  //> destructure email from request body
  const { email } = req.body;
  //> check for email
  if (!email) throw new err.BAD_REQUEST(`Please provide a email`);

  //> check for user exist on this mail or not
  const user = await User.findOne({ email }).select(
    "name email passwordToken passwordExpirationDate"
  );
  if (user) {
    //> generate password token and save in database with expiration
    let passwordToken = await crypto.randomBytes(70).toString("hex");
    user.passwordToken = passwordToken;
    const _15min = 1000 * 60 * 15;
    user.passwordTokenExpirationDate = new Date(Date.now() + _15min);
    await user.save();
    //> encrypt token
    passwordToken = await encryptToken(passwordToken);
    //> send reset password email
    await sendResetPasswordMail({
      name: user.name,
      email: user.email,
      passwordToken,
      origin: process.env.ORIGIN,
    });
  }

  res
    .status(200)
    .json({ message: `Please Check your Email and reset your password` });
};

//Reset Password//
const resetPassword = async (req, res) => {
  const { password, token } = req.body;
  if (!token || !password)
    throw new err.BAD_REQUEST(`Please provide all credentials`);

  const payload = isValid(token);
  const user = await User.findOne({
    email: payload?.email,
  }).select("passwordToken passwordTokenExpirationDate password");
  //> if user found//
  if (user) {
    //> check is password token valid
    const isPasswordTokenValid = await user.comparePasswordToken(
      payload.passwordToken
    );
    if (!isPasswordTokenValid)
      throw new err.UNAUTHORIZED(`User Verification failed`);

    (user.passwordToken = null),
      (user.passwordTokenExpirationDate = null),
      (user.password = password);
    await user.save();
  }

  res
    .status(StatusCodes.ACCEPTED)
    .json({ message: `Password Updated Successfully` });
};

//log out//
const prevlogout = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId });
  res.cookie("accessToken", "logout", {
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    expires: new Date(Date.now()),
  });
  res.status(200).json({ message: `Ok` });
};

const logout = async (req, res) => {
  res.cookie("userToken", "logout", {
    expires: new Date(Date.now()),
  });
  res.status(200).json({ message: `Ok` });
};

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyMail,
};
