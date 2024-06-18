import User from "../models/signup.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import formatFile from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import CustomError from "../utils/customError.js"
const generateJwt = async (id) => {
  const foundUser = await User.findById(id);
  if (!foundUser) {
    throw new Error("Token generation failed");
  } else {
    let token = jwt.sign(
      {
        id: foundUser._id,
        fullName: foundUser.fullName,
        email: foundUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return token;
  }
};

const signup = asyncHandler(async (req, res) => {
  //   console.log(req.body, req.file);
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    throw new Error("all the fields are required");
  } else {
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      res.status(404).send(new CustomError("User already exist",404))
    } else {
      const formattedFile = formatFile(req.file);
      const uploadedImage = await cloudinary.uploader.upload(
        formattedFile.content,
        { folder: "blogapp" }
      );
      const user = await User.create({
        fullName,
        email,
        password,
        img: {
          public_id: uploadedImage.public_id,
          secure_url: uploadedImage.secure_url,
        },
      });
      res.status(200).send(new ApiResponse(200, user));
    }
  }
});
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(500).send(new CustomError("all fields are required"))
  } else {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).send(new CustomError("user does not exist",404))
    } else {
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        res.status(401).send(new CustomError("invalid credentials",404));
      } else {
        const token = await generateJwt(user._id);
        const options = {
          httpOnly: true,
          secure: true,
          maxAge: 86400000, // 1 day
          sameSite: 'None', // Prevent CSRF
        };
        res
          .cookie("accessToken", token, options)
          .status(200)
          .send(new ApiResponse(200, { message: "login successfull", token,id:user._id,user }));
      }
    }
  }
});
const logout = asyncHandler(async (req, res) => {

  const options = {
    httpOnly: true,
    secure: true,
    maxAge: 0, // 1 day
    sameSite: 'None', // Prevent CSRF
  };
  res.clearCookie("accessToken", options).status(200).send(new ApiResponse(200,{message:`${req.user.fullName} is logout successfully`}));
});
export { signup, login, logout };
