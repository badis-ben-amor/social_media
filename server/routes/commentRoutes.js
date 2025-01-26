const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware.js");
const {
  createCommentPost,
  getComments,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

router.post("/", authMiddleware, createCommentPost);
router.get("/", getComments);
router.put("/", authMiddleware, updateComment);
router.delete("/", authMiddleware, deleteComment);

module.exports = router;
