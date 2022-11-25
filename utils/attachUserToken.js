const { createJWT } = require("./jwt");

const attachUserTokenToResponse = ({ res, payload }) => {
  const userToken = createJWT({ payload });
  //validity 1 week
  const _1Week = 1000 * 60 * 60 * 24 * 7;
  //attach cookie
  res.cookie("userToken", userToken, {
    httpOnly: true,
    signed: true,
    secure: process.env?.NODE_ENV === `production`,
    expires: new Date(Date.now() + _1Week),
  });
};

module.exports = attachUserTokenToResponse;
