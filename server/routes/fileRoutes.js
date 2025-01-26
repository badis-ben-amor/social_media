const express = require("express");
const router = express.Router();
const fileAccessMiddleware = require("../middlewares/fileAccessMiddleware");
const { sendFile } = require("../controllers/fileController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.get("/:filename", fileAccessMiddleware, sendFile);

module.exports = router;
