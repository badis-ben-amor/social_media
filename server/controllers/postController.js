const Post = require("../models/Post");
const Like = require("../models/Like");
const Comment = require("../models/Comment");
const cloudinary = require("../config/cloudinaryConfig");

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name avatar")
      .populate({ path: "comments", populate: { path: "comment user" } })
      .populate("likes")
      .sort({ createdAt: -1 });
    if (!posts) return res.status(404).json({ message: "No posts found" });
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

  if (!content && !req.file?.filename)
    return res
      .status(400)
      .json({ message: "Content or image a least required" });
  try {
    if (req.file) {
      const result = cloudinary.uploader.upload(
        req.file.path,
        async (error, result) => {
          if (error) {
            return res.status(500).json({ message: error.message });
          }
          const post = new Post({
            user: userId,
            content,
            image: result.secure_url,
          });
          await post.save();
          res.status(201).json({ message: "Post created successffuly", post });
        }
      );
    } else {
      const post = new Post({
        user: userId,
        content,
        image: null,
      });
      await post.save();
      return res
        .status(201)
        .json({ message: "Post created successffuly", post });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed creating post",
      ...(process.env.NODE_ENV !== "production" && {
        error: error.message,
      }),
    });
  }
};

exports.updatePost = async (req, res) => {
  const { postId, content, removedImage } = req.body;
  const userId = req.user.id;
  console.log(removedImage);
  const image = req.file?.filename;

  if (!postId || !userId)
    return res.status(400).json({ message: "Post or user ID missing " });

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!content && !image && !post.image)
      return res.status(400).json({
        message: "Content or image at least require to update you post",
      });

    if (req.file) {
      cloudinary.uploader.upload(req.file.path, async (error, result) => {
        if (error) {
          return res.status(500).json({ message: error.message });
        }
        const updatedPost = await Post.findOneAndUpdate(
          {
            _id: postId,
            user: userId,
          },
          { content, image: result.secure_url },
          { new: true }
        );

        return res.status(200).json({ message: "Post updated successfully" });
      });
    } else {
      await Post.findOneAndUpdate(
        {
          _id: postId,
          user: userId,
        },
        {
          content,
          image: removedImage === "false" ? post.image : null,
        },
        { new: true }
      );

      return res.status(200).json({ message: "Post updated successfully" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error Updating Post",
      ...(process.env !== "production" && { error: error.message }),
    });
  }
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
