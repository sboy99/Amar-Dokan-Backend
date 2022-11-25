const sendMail = require("../utils/sendMail");
const { passwordTokenJWT } = require("../utils");
const sendResetPasswordMail = async ({
  name,
  email,
  passwordToken,
  origin,
}) => {
  const token = passwordTokenJWT({ email, passwordToken });
  const url = `${origin}/reset-password/${token}`;
  const message = `Hello ${name},<br/> Please Reset your password.<br/><a href="${url}">Reset Password<a/>`;

  return sendMail({ to: email, subject: "Reset your Password", html: message });
};

module.exports = sendResetPasswordMail;
