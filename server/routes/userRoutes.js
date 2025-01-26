const express = require("express");
const { getUserProfile } = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getUserProfile);

module.exports = router;
