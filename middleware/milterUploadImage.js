const err = require("../errors");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const _1KB = 1024;
const _512KB = 512 * _1KB;
const _1MB = 1024 * _1KB;

const uploadImageMulter =
  (fieldName, maxSizeInMB, dest) => async (req, res, next) => {
    // if no files send bad request
    if (!req.file) throw new err.BAD_REQUEST(`Please select an image`);
    const fileObject = req.file;
    console.log(fileObject);
    const filePath = fileObject.path;

    // check for image type files only
    if (!fileObject.mimetype.startsWith("image")) {
      fs.unlinkSync(filePath);
      throw new err.BAD_REQUEST(`Not an image, please select an image file`);
    }

    // check for image size
    if (fileObject.size > maxSizeInMB * _1MB) {
      fs.unlinkSync(filePath);
      throw new err.BAD_REQUEST(
        `Image file should not exceeds ${maxSizeInMB} MB`
      );
    }
    // ? If every check passed
    // upload file to coludinary
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      filePath,
      { folder: dest }
    );
    req.body[fieldName] = { id: public_id, url: secure_url };
    // unlink temporary file..
    fs.unlinkSync(filePath);
    next();
  };

module.exports = uploadImageMulter;
