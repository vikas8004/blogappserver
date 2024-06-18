import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routers/user.router.js";
import postRouter from "./routers/post.router.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173","https://blogwave123.netlify.app"],
    credentials: true,
  })
);
app.use("/api/v1", userRouter);
app.use("/api/v1", postRouter);
export default app;
