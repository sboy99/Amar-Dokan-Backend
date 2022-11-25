const { StatusCodes: sts } = require("http-status-codes");

const notFoundMiddleware = (req, res) => {
  res.status(sts.NOT_FOUND).json({ message: `Route does not exist` });
};
module.exports = notFoundMiddleware;
