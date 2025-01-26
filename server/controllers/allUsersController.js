const User = require("../models/User");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).populate("_id name avatar");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching all users",
      ...(process.env !== "production" && { error: error.message }),
    });
  }
};

module.exports = { getAllUsers };
