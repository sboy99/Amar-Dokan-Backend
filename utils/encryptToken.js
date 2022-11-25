const bcryptjs = require("bcryptjs");

const encryptToken = async (token) => {
  const salt = await bcryptjs.genSalt(10);
  const encryptedToken = await bcryptjs.hash(token, salt);
  return encryptedToken;
};

module.exports = encryptToken;
