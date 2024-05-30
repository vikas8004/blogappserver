import Post from "../models/post.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import formatFile from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
const createPost = asyncHandler(async (req, res) => {
  const { title, description, category, author } = req.body;
  if (!title || !description || !category || !author) {
    throw new Error("Every field is required");
  } else {
    const fromattedFile = formatFile(req.file);
    const uploadedImage = await cloudinary.uploader.upload(
      fromattedFile.content,
      { folder: "blogapp" }
    );
    const post = await Post.create({
      title,
      description,
      category,
      author,
      image: {
        public_id: uploadedImage.public_id,
        secure_url: uploadedImage.secure_url,
      },
    });
    if (!post) {
      throw new Error("Post uploading failed");
    } else {
      res.status(200).send(new ApiResponse(200, post));
    }
  }
});

const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate("author", "img fullName");
  res.status(200).send(new ApiResponse(200, posts));
});
const getPostByCategory = asyncHandler(async (req, res, next) => {
  try {
    const cat = req.params;
    const posts = await Post.find({ category: cat.category }).populate(
      "author",
      "img fullName"
    );
    if (!posts.length) {
      res.status(200).send(new ApiResponse(200, { message: "No posts" }));
    } else {
      res.status(200).send(new ApiResponse(200, posts));
    }
  } catch (error) {
    next(error);
  }
});
export { createPost, getPosts, getPostByCategory };
