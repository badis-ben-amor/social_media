const fs = require("fs");
const path = require("path");

const fileAccessMiddleware = (req, res, next) => {
  const filePath = path.join(__dirname, "../uploads", req.params.filename);
  if (fs.existsSync(filePath)) {
    req.filePath = filePath;
    next();
  } else {
    res.status(400).json({ message: "File not found" });
  }
};

module.exports = fileAccessMiddleware;
