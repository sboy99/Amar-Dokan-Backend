const createPayload = (user) => {
  return {
    userId: user?._id,
    role: user?.role,
  };
};

module.exports = createPayload;
