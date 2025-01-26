const User = require("../models/User");

const getUserProfile = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      ...(process.env.NODE_ENV !== "production" && { error: error.message }),
    });
  }
};

module.exports = { getUserProfile };
