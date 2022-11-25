const { StatusCodes: sts } = require("http-status-codes");
const cloudinary = require("cloudinary").v2;
const { structureErr } = require("../utils");

const errorHandlerMiddleware = async (err, req, res, next) => {
  const defaultError = {
    status: err?.statusCode || sts.INTERNAL_SERVER_ERROR,
    message: err?.message || `Something went wrong!, please try again later..`,
  };

  // -Validation Errors- //
  if (err.name === `ValidationError`) {
    const { image, imagePublicId } = req.body;
    if (image) await cloudinary.uploader.destroy(imagePublicId);

    if (err?.inner) {
      // Yup Validation Error
      defaultError.message = err.inner.reduce((acc, curr) => {
        acc[curr?.path] = curr?.message;
        return acc;
      }, {});
    } else {
      // Native MongoDB validation Error
      defaultError.message = structureErr(err);
    }
    defaultError.status = sts.BAD_REQUEST;
  }

  //*Error Code is a number *//
  if (err?.code === 11000) {
    defaultError.message = Object.keys(err.keyValue)
      .map((key) => `${key} already exist`)
      .join(",");
    defaultError.status = sts.BAD_REQUEST;
  }

  if (err.name === `CastError` || err?.errors?.name === `CastError`) {
    defaultError.message = `Id verification failed`;
    defaultError.status = sts.NOT_FOUND;
  }

  res.status(defaultError.status).json({
    message: defaultError.message,
  });
};

module.exports = errorHandlerMiddleware;
