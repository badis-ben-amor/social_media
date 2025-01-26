const mongoose = require("mongoose");
const User = require("../../models/User");
const bcrypt = require("bcrypt");

const getAllUsersAdmin = async (req, res) => {
  try {
    const users = await User.find({}, "-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      ...(process.env.NODE_ENV === "production" && { error: error.message }),
    });
  }
};

const getOneUserAdmin = async (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ message: "User ID is required" });
  try {
    const user = await User.findById(userId, "-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      ...(process.env.NODE_ENV !== "production" && { error: error.message }),
    });
  }
};

const createUserAdmin = async (req, res) => {
  const { name, email, password, isAdmin = false } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields is required" });
  try {
    const user = await User.findOne({ email });
    if (user) return res.status(404).json({ message: "User already exist" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin,
    });
    await newUser.save();
    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      ...(process.env.NODE_ENV !== "production" && { error: error.message }),
    });
  }
};

const updateUserAdmin = async (req, res) => {
  const { userId } = req.params;
  const { name, email, isAdmin } = req.body;
  if (isAdmin !== undefined && typeof isAdmin !== "boolean")
    return res.status(400).json({ message: "Not a valid admin value" });
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(name && { name }),
        ...(email && { email }),
        ...(isAdmin !== undefined && { isAdmin }),
      },
      { new: true }
    ).select("-password");
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      ...User(
        process.env.NODE_ENV !== "production" && { error: error.message }
      ),
    });
  }
};

const deleteUserAdmin = async (req, res) => {
  const { userId } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      ...(process.env.NODE_ENV !== "production"),
    });
  }
};

module.exports = {
  getAllUsersAdmin,
  getOneUserAdmin,
  createUserAdmin,
  updateUserAdmin,
  deleteUserAdmin,
};
