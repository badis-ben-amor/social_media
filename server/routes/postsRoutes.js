const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  getPosts,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.get("/", getPosts);
router.post("/", authMiddleware, upload.single("image"), createPost);
router.put("/", authMiddleware, upload.single("image"), updatePost);
router.delete("/", authMiddleware, deletePost);

module.exports = router;
