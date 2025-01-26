const express = require("express");
const router = express.Router();
const { createLikePost, deleteLike } = require("../controllers/likeController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createLikePost);
router.delete("/", authMiddleware, deleteLike);

module.exports = router;
