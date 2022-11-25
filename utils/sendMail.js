// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const nodemailer = require("nodemailer");
const nodemailerConfig = require("./nodemailer.config");

const sendMail = async ({ to, subject, html }) => {
  //>SendGrid mail
  // await sgMail.send({
  //   to,
  //   from: process.env.SENDER_ID,
  //   subject,
  //   html,
  // });
  //>Ethereal mail
  let transporter = nodemailer.createTransport(nodemailerConfig);
  await transporter.sendMail({ to, subject, html });
};

module.exports = sendMail;
