import express from "express";
import { registerUser } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
const userRouter = express.Router();
userRouter
  .route("/user/register")
  .post(upload.single("avatar"), registerUser);

export default userRouter;
