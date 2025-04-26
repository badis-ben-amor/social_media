const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, isAdmin: user.isAdmin },
    process.env.ACCESS_SECRET,
    { expiresIn: "98s" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, isAdmin: user.isAdmin },
    process.env.REFRESH_SECRET,
    { expiresIn: "48d" }
  );
};

const register = async (req, res) => {
  const { name, email, password } = req.body.userData;
  try {
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    res.cookie("refreshToken", refreshToken, {
      htppOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      message: "User register successfully",
      // user: { id: newUser.id, isAdmin: newUser.isAdmin },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      ...(process.env.NODE_ENV !== "production" && { error: error.message }),
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body.userData;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const comparedPassword = await bcrypt.compare(password, user.password);
    if (!comparedPassword)
      return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      message: "User login successfully",
      user: { id: user.id, isAdmin: user.isAdmin },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      ...(process.env.NODE_ENV !== "production" && { error: error.message }),
    });
  }
};

const refersh = async (req, res) => {
  // const { refreshToken } = req.cookies;
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({ message: "Refresh token missing" });
  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    const user = await User.findById(payload.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newAccessToken = generateAccessToken(user);

    res.status(200).json({ message: "Access token updates", newAccessToken });
  } catch (error) {
    res.status(403).json({
      message: "Invalid or expired refresh token",
      ...(process.env.NODE_ENV !== "production" && { error: error.message }),
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      ...(process.env.NODE_ENV === "production" && { error: error.message }),
    });
  }
};

module.exports = { login, register, refersh, logout };
