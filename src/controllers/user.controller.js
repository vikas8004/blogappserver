import User from "../models/signup.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import formatFile from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
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
      throw new Error("user already exists");
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
    throw new Error("all the fields are required");
  } else {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("user does not exist");
    } else {
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        throw new Error("Invalid credentials");
      } else {
        const token = await generateJwt(user._id);
        const options = {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Set to true if in production
          maxAge: 86400000,
          sameSite: "None",
        };
        res
          .cookie("accessToken", token, options)
          .status(200)
          .send(new ApiResponse(200, { message: "login successfull", token,id:user._id }));
      }
    }
  }
});
const logout = asyncHandler(async (req, res) => {
 
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to true if in production
    sameSite: "None",
  };
  res.clearCookie("accessToken", options).status(200).send(new ApiResponse(200,{message:`${req.user.fullName} is logout successfully`}));
});
export { signup, login, logout };
