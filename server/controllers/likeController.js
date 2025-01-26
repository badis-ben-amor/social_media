const Like = require("../models/Like");
const Post = require("../models/Post");

exports.createLikePost = async (req, res) => {
  const { postId } = req.body;
  const userId = req.user.id;

  if (!postId) return res.status(400).json({ message: "Post id require" });
  if (!userId) return res.status(400).json({ message: "User id require" });
  try {
    const existingLike = await Like.findOne({ user: userId, post: postId });
    if (existingLike)
      return res
        .status(400)
        .json({ message: "User has already like this post" });

    const like = new Like({
      user: userId,
      post: postId,
    });
    await like.save();
    const likeInLike = await Like.findOne({
      user: userId,
      post: postId,
    });

    await Post.findByIdAndUpdate(postId, { $push: { likes: likeInLike._id } });
    res.status(200).json({ message: "Post liked successfully", likeInLike });
  } catch (error) {
    res.status(500).json({
      message: "Like post failed",
      ...(process.env.NODE_ENV !== "production" && { error: error.message }),
    });
  }
};

exports.deleteLike = async (req, res) => {
  const { postId, likeId } = req.query;
  const userId = req.user.id;
  if (!postId || !likeId)
    return res.status(400).json({ message: "Post id or likeId missing" });
  if (!userId) return res.status(400).json({ message: "User id missing" });
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    await Like.findByIdAndDelete(likeId);
    const deletedLikeFromPost = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: likeId },
      },
      { new: true }
    );
    const likeIsDeletedFromPost = deletedLikeFromPost.likes.some(
      (like) => like._id.toString() === likeId.toString()
    );
    if (likeIsDeletedFromPost)
      return res.status(400).json({ message: "Unable to delete like" });
    res.status(200).json({ message: "Like remove successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Remove like error",
      ...(process.env.NODE_ENV !== "prodution" && { error: error.message }),
    });
  }
};
