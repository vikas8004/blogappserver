import nodemailer from "nodemailer";

async function sendMail(otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 467,
    secure: true,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });
  const options = {
    from: "vikas723908@gmail.com",
    to: "vikashkumarchaudhary635@gmail.com",
    subject: "hello",
    text: "hello this male is generated from node js",
    html: `<h1 style="color:red,background:"green">${otp}</h1>`,
  };
  let res = await transporter.sendMail(options);
  return res;
}
export default sendMail;
