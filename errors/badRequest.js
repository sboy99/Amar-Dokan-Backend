const customError = require("./customError");

class BAD_REQUEST extends customError {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = BAD_REQUEST;
