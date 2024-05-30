import { signup, login, logout } from "../controllers/user.controller.js";
import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import verifyJwt from "../middlewares/verifyJwt.middleware.js";

const userRouter = Router();

userRouter.route("/signup").post(upload.single("img"), signup);
userRouter.route("/signin").post(login);
userRouter.route("/logout").post(verifyJwt,logout)

export default userRouter;
