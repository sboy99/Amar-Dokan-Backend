const err = require("../errors");
const Token = require("../model/token");
const { isValid, attachCookiesToResponse } = require("../utils/jwt");

const authintication = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies;

  if (!refreshToken && !accessToken)
    throw new err.UNAUTHORIZED(`Please re-login`);

  try {
    if (accessToken) {
      const payload = isValid(accessToken);
      req.user = payload;
      next();
      return;
    }

    const payload = isValid(refreshToken);
    const isUserActive = await Token.findOne({
      user: payload.userId,
      refreshToken: payload.refreshToken,
    });
    if (isUserActive && !isUserActive.blocked) {
      const { refreshToken, ...user } = payload;
      attachCookiesToResponse({ res, user, refreshToken });
      req.user = user;
      next();
      return;
    }
    // should be returned if no token found in db
    throw new err.UNAUTHORIZED(`User Verification failed`);
  } catch (error) {
    throw new err.UNAUTHORIZED(`User Verification failed`);
  }
};

const hasPermission = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      throw new err.FORBIDDEN(`Access Denied`);
    }
    next();
  };
};

module.exports = { authintication, hasPermission };
