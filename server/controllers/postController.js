const Post = require("../models/Post");
const Like = require("../models/Like");
const Comment = require("../models/Comment");
const path = require("path");

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name avatar")
      .populate({ path: "comments", populate: { path: "comment user" } })
      .populate("likes");
    if (!posts || posts.length === 0)
      return res.status(404).json({ message: "No posts found" });
    return res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching posts",
      ...(process.env.NODE_ENV !== "production" && { error: error.message }),
    });
  }
};

exports.createPost = async (req, res) => {
  const userId = req.user.id;
  const { content } = req.body;
  const image = req.file
    ? path.join(__dirname, `../uploads/${req.file.filename}`)
    : null;

  if (!content && !image)
    return res
      .status(400)
      .json({ message: "Content or image a least required" });
  try {
    const post = new Post({
      user: userId,
      content,
      image: req.file?.filename || null,
    });
    await post.save();
    return res.status(201).json({ message: "Post created successffuly", post });
  } catch (error) {
    res.status(500).json({
      message: "Failed creating post",
      ...(process.env.NODE_ENV !== "production" && { error: error.message }),
    });
  }
};

exports.updatePost = async (req, res) => {
  const { postId, content } = req.body;
  const userId = req.user.id;
  const image = req.file;
  if (!postId || !userId)
    return res.status(400).json({ message: "Post or user ID missing " });
  if (!content && !image)
    return res.status(400).json({
      message: "Content or image at least require to update you post",
    });
  try {
    const updatedPost = await Post.findOneAndUpdate(
      {
        _id: postId,
        user: userId,
      },
      { content, image: req.file?.filename },
      { new: true }
    );
    if (!updatedPost)
      return res.status(404).json({ message: "Post not found" });

    return res
      .status(200)
      .json({ message: "Post updated successfully", updatedPost });
  } catch (error) {}
};

exports.deletePost = async (req, res) => {
  const { postId } = req.query;
  const userId = req.user.id;
  if (!postId || !userId)
    return res.status(400).json({ message: "post or user ID missing" });
  try {
    const deletedPost = await Post.findOneAndDelete({
      _id: postId,
      user: userId,
    });
    if (!deletedPost)
      return res.status(404).json({ message: "Post not found" });
    await Like.deleteMany({ post: postId });
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting post",
      ...(process.env.NODE_ENV !== "production" && { error: error.message }),
    });
  }
};
