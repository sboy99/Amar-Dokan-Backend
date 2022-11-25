const err = require("../errors");
const jwt = require("jsonwebtoken");

const verificationJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.VERIFICATION_EXPIRES_IN,
  });
};

const passwordTokenJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.PASSWORD_TOKEN_EXPIRES_IN,
  });
};

const createJWT = ({ payload }) => {
  return jwt.sign(payload, process.env.JWT_SECRET);
};

const isValid = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new err.FORBIDDEN(`user verification failed`);
  }
};

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  //> create 2 jwt token access token refresh token
  //> Access Token JWT
  const accessTokenJWT = createJWT({ payload: user });
  //> Refresh Token JWT
  const refreshTokenJWT = createJWT({ payload: { ...user, refreshToken } });

  //> setup signed cookies http only, secure on production, validity
  const _1Week = 1000 * 60 * 60 * 24 * 7;
  const _15mins = 1000 * 60 * 15;

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    signed: true,
    secure: process.env?.NODE_ENV === `production`,
    expires: new Date(Date.now() + _1Week),
  });
  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    signed: true,
    secure: process.env?.NODE_ENV === `production`,
    expires: new Date(Date.now() + _15mins),
  });
};

module.exports = {
  passwordTokenJWT,
  attachCookiesToResponse,
  verificationJWT,
  isValid,
  createJWT,
};
