const createPayload = require("./createPayload");
const encryptToken = require("./encryptToken");
const getRefreshToken = require("./getRefreshToken");
const sendMail = require("./sendMail");
const sendVerificationMail = require("./sendVerificationMail");
const attachUserTokenToResponse = require("./attachUserToken");
const createUserPayload = require("./createUserPayload");
const structureErr = require("../utils/structureMonogodbErr");
const {
  verificationJWT,
  passwordTokenJWT,
  attachCookiesToResponse,
  isValid,
  createJWT,
} = require("./jwt");

module.exports = {
  structureErr,
  createUserPayload,
  attachUserTokenToResponse,
  passwordTokenJWT,
  attachCookiesToResponse,
  isValid,
  createJWT,
  encryptToken,
  getRefreshToken,
  createPayload,
  verificationJWT,
  sendMail,
  sendVerificationMail,
};
