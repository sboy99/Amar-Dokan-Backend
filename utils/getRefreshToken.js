const Token = require("../model/token");
const crypto = require("crypto");

//*Refresh Token*//
const getRefreshToken = async ({ req, userId }) => {
  let refreshToken = "";

  //> check for refresh token
  const haveRefreshToken = await Token.findOne({ user: userId });

  //> if token is available then attach that token if not create new token
  if (haveRefreshToken) {
    const { blocked } = haveRefreshToken;
    if (blocked) throw new err.FORBIDDEN(`You don't have permission `);
    refreshToken = haveRefreshToken.refreshToken;
  } else {
    //> user login first time or refresh token expired
    refreshToken = await crypto.randomBytes(70).toString("hex");
    const refreshTokenUser = {
      refreshToken,
      ip: req.ip,
      userAgent: req.get("user-agent"),
      user: userId,
    };
    await Token.create(refreshTokenUser);
  }
  return refreshToken;
};

module.exports = getRefreshToken;
