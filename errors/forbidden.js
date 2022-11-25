const customError = require("./customError");

class FORBIDDEN extends customError {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = FORBIDDEN;
