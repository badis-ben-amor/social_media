const User = require("../models/User");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer"))
    return res
      .status(401)
      .json({ message: "Unautouriazed:Token not provided" });

  const token = authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({
      message: "Invalid or expired access token",
      ...(process.env.NODE_ENV !== "production" && { error: error.message }),
    });
  }
};

const adminMiddleware = (req, res, next) => {
  // if (!req.user || !req.user.isAdmin)
  if (!req.user)
    return res.status(401).json({ message: "Access denied, Admin only" });
  next();
};

module.exports = { authMiddleware, adminMiddleware };
