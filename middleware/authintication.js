const err = require("../errors");
const firebase = require("firebase-admin");
const User = require("../model/user");
const {
  isValid,
  attachUserTokenToResponse,
  createUserPayload,
  createPayload,
} = require("../utils");

const authintication = async (req, res, next) => {
  try {
    const idToken = req.get("Authorization")
      ? req.get("Authorization").split("Bearer ")[1]
      : null;

    const userCred = await firebase.auth().verifyIdToken(idToken);
    if (userCred) {
      const { userToken } = req.signedCookies;
      let userRole;
      // if user token isn't present
      if (!userToken) {
        //get user role & userId
        userRole = createPayload(
          await User.findOne({ email: userCred?.email }).select("_id role")
        );
        //attach user Token to response as cookie
        attachUserTokenToResponse({ res, payload: userRole });
      } else {
        //get user details through jwt verification
        userRole = isValid(userToken);
      }
      //make user payload from firebase creadentials as well as user role
      const user = createUserPayload(userCred, userRole);
      //set user to req
      req.user = user;
    }
    next();
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
