const structureErr = (err) => {
  let obj = {};
  const keys = Object.keys(err.errors);
  const values = Object.values(err.errors);

  for (let index in keys) {
    obj[keys[index]] = values[index].message;
  }

  return obj;
};

module.exports = structureErr;
