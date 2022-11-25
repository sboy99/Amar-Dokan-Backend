const createUserPayload = (user, role) => {
  return {
    userId: role?.userId,
    name: user?.name,
    isVerified: user?.email_verified,
    image: user?.picture || null,
    role: role?.role,
  };
};

module.exports = createUserPayload;
