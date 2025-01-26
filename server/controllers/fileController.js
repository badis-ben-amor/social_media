exports.sendFile = (req, res) => {
  res.sendFile(req.filePath);
};
