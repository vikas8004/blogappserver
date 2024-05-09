import asyncHandler from "../utils/asyncHandler.js";
import cloudinary from "../utils/cloudinary.js";
import formatFile from "../utils/datauri.js";
import sendMail from "../utils/nodemailer.js";
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  // console.log(fullName, req.file);

  const fromattedFile = formatFile(req.file);
  if (fromattedFile) {
    sendMail(Math.floor(Math.random() * 600000 + 1))
      .then((res) => {
        console.log(res.messageId);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
  res.status(200).send({ message: "otp sent successfully" });
});

export { registerUser };
