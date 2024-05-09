import mongoose, { model, Schema } from "mongoose";

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
});

const Comment = model("Comment", commentSchema);
export default Comment;
