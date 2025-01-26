const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  getMessages,
  sentMessage,
} = require("../controllers/messageController");

const router = express.Router();

router.get("/:userId", authMiddleware, getMessages);
router.post("/", authMiddleware, (req, res) =>
  sentMessage(req, res, req.app.get("io"))
);

module.exports = router;
