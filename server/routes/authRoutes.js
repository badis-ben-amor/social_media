const express = require("express");
const {
  register,
  login,
  refersh,
  logout,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refersh);
router.post("/logout", logout);

module.exports = router;
