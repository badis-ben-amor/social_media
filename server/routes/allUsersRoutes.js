const express = require("express");
const { getAllUsers } = require("../controllers/allUsersController");

const router = express.Router();

router.get("/", getAllUsers);

module.exports = router;
