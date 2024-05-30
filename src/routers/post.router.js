import express from "express";
import upload from "../middlewares/multer.middleware.js"
import { createPost, getPostByCategory, getPosts } from "../controllers/post.controller.js";
import verifyJwt from "../middlewares/verifyJwt.middleware.js"
const postRouter = express.Router();

postRouter.route("/createpost").post(verifyJwt,upload.single("image"),createPost);
postRouter.route("/posts").get(getPosts);
postRouter.route("/posts/:category").get(getPostByCategory)

export default postRouter;
