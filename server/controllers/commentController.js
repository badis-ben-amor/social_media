const Post = require("../models/Post");
const Comment = require("../models/Comment");

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({});
    if (!comments || comments.length === 0)
      return res.status(400).json({ message: "Not comments found" });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching comments",
      ...(process.env.NODE_ENV !== "production" && { error: error.message }),
    });
  }
};

exports.createCommentPost = async (req, res) => {
  const userId = req.user.id;
  const { postId, content } = req.body;
  if (!userId) return res.status(400).json({ message: "User id require" });
  if (!postId) return res.status(400).json({ message: "Post id require" });
  if (!content) return res.status(400).json({ message: "Conten id require" });
  try {
    existingPost = await Post.findById(postId);
    if (!existingPost)
      return res.status(404).json({ message: "Post not found" });

    const newCommentInComment = new Comment({
      user: userId,
      post: postId,
      content,
    });
    await newCommentInComment.save();

    await Post.findByIdAndUpdate(postId, {
      $push: { comments: { comment: newCommentInComment._id, user: userId } },
    });

    res
      .status(201)
      .json({ message: "Comment create successffuly", newCommentInComment });
  } catch (error) {
    res.status(500).json({
      message: "Error create comment",
      ...(process.env.NODE_ENV !== "production" && { error: error.message }),
    });
  }
};

exports.updateComment = async (req, res) => {
  const { postId, commentId, content } = req.body;
  const userId = req.user.id;
  if (!postId || !commentId || !content)
    return res
      .status(400)
      .json({ message: "Post id or comment id or content missing" });
  if (!userId) return res.status(400).json({ message: "User id missing" });
  try {
    const existingPost = await Post.findById(postId);
    if (!existingPost)
      return res.status(404).json({ message: "Post not found" });

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        user: userId,
        post: postId,
        content,
      },
      { new: true }
    );
    await updatedComment.save();
    res
      .status(200)
      .json({ message: "Comment updated successfully", updatedComment });
  } catch (error) {
    res.status(500).json({
      message: "Error updating comment",
      ...(process.env.NODE_ENV !== "production" && { error: error.message }),
    });
  }
};

exports.deleteComment = async (req, res) => {
  const { commentId, postId } = req.query;
  const userId = req.user.id;
  if (!commentId || !postId)
    return res.status(400).json({ message: "Post and comment ID require" });
  if (!userId) return res.status(400).json({ message: "User ID require" });
  try {
    const existingPost = await Post.findById(postId);
    if (!existingPost)
      return res
        .status(404)
        .json({ message: "Post of that comment not found" });
    await Comment.findOneAndDelete({ _id: commentId, user: userId });
    const deletedCommentFromPost = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { comments: { comment: commentId, user: userId } },
      },
      { new: true }
    );
    const existingCommentInPost = deletedCommentFromPost.comments.some(
      (comment) =>
        comment.comment.toString() === commentId &&
        comment.user.toString() === userId
    );
    if (existingCommentInPost)
      return res.status(400).json({ message: "Unable to delete comment" });

    res
      .status(200)
      .json({ message: "Comment delete successefully from database" });
  } catch (error) {
    res.status(500).json({
      message: "Error updating comment",
      ...(process.env.NODE_ENV !== "production" && { error: error.message }),
    });
  }
};
