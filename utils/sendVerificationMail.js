const { verificationJWT } = require("./jwt");
const sendMail = require("./sendMail");

const sendVerificationMail = async (name, email, verificationToken, origin) => {
  //> Create JWT Token
  const token = verificationJWT({ email, verificationToken });
  const url = `${origin}/verify-email/${token}`;
  const message = `Hello ${name},<br/> Thank you for sign in.<br/>Here is your verification link <br/> <a href="${url}">Verify<a/>`;
  return sendMail({
    to: email,
    subject: `Verify Email Address`,
    html: message,
  });
};

module.exports = sendVerificationMail;
