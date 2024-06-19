import Post from "../models/post.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import formatFile from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import CustomError from "../utils/customError.js";
const createPost = asyncHandler(async (req, res) => {
  const { title, description, category, author } = req.body;
  // console.log(req.body);
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
      res.status(500).send(new CustomError("Post creation failed"));
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
    console.log();

    if (cat.category === "For you") {
      const posts = await Post.find().populate("author", "img fullName");
      res.status(200).send(new ApiResponse(200, posts));
    } else {
      const posts = await Post.find({ category: cat.category }).populate(
        "author",
        "img fullName"
      );
      if (!posts.length) {
        res.status(200).send(new ApiResponse(200, []));
      } else {
        res.status(200).send(new ApiResponse(200, posts));
      }
    }
  } catch (error) {
    next(error);
  }
});
const getPostById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  const post = await Post.findById(id).populate("author", "img fullName");
  // console.log(post);
  res.status(200).send(new ApiResponse(200, { post }));
});
const getPostForUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  // console.log(id);
  const posts = await Post.find({ author: id }).populate("author", "fullName img");
  // console.log(posts);
  res.status(200).send(new ApiResponse(200, posts));
});
export { createPost, getPosts, getPostByCategory, getPostById, getPostForUser };
