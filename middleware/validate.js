const validateData = (schema) => async (req, res, next) => {
  await schema.validate(req.body, { abortEarly: false });
  next();
};

const validateParams = (schema) => async (req, res, next) => {
  await schema.validate(req.params, { abortEarly: false });
  next();
};

module.exports = { validateData, validateParams };
