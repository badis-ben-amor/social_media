const express = require("express");
const {
  getAllUsersAdmin,
  createUserAdmin,
  updateUserAdmin,
  deleteUserAdmin,
} = require("../../controllers/admin/userAdminController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, getAllUsersAdmin);
router.post("/", authMiddleware, adminMiddleware, createUserAdmin);
router.put("/:userId", authMiddleware, adminMiddleware, updateUserAdmin);
router.delete("/:userId", authMiddleware, adminMiddleware, deleteUserAdmin);

module.exports = router;
