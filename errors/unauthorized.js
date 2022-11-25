const customError = require("./customError");

class UNAUTHORIZED extends customError {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = UNAUTHORIZED;
