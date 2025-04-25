const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer"))
    return res
      .status(401)
      .json({ message: "Unautouriazed:Token not provided" });

  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid or expired access token",
      ...(process.env.NODE_ENV !== "production" && { error: error.message }),
    });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user || !req.user.isAdmin)
    return res.status(403).json({ message: "Access denied, Admin only" });
  next();
};

module.exports = { authMiddleware, adminMiddleware };
