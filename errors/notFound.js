const customError = require("./customError");

class NOT_FOUND extends customError {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = NOT_FOUND;
