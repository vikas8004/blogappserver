import { signup, login, logout } from "../controllers/user.controller.js";
import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import verifyJwt from "../middlewares/verifyJwt.middleware.js";
import { baseUrl } from "../../../client/src/utils/constants.js";
import { isAuthenticated } from "../middlewares/loginMiddleware.js";

const userRouter = Router();

userRouter.route("/signup").post(upload.single("img"), signup);
userRouter.route("/signin").post(login);
userRouter.route("/logout").post(verifyJwt, logout);
userRouter.route("/islogin").get(isAuthenticated);

export default userRouter;
