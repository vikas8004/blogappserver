import jwt from "jsonwebtoken";
import User from "../models/signup.model.js";
import CustomError from "../utils/customError.js";
export const isAuthenticated = async (req, res) => {
  let accessToken = req.cookies.accessToken;
  if (accessToken) {
    let decodedData = jwt.verify(accessToken, process.env.JWT_SECRET);
    if (decodedData) {
    //   console.log(decodedData);
      const user = await User.findById(decodedData.id);
      if (!user) {
        res.status(401).send(new CustomError("Invalid token", 401));
      } else {
        res.status(200).send({ user, accessToken });
      }
    }
  } else {
    res.status(401).send(new CustomError("No token provided", 401));
  }
};
