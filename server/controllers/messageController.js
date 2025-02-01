const Message = require("../models/Message");

const getMessages = async (req, res) => {
  try {
    const { id } = req.user;
    const currentUserId = req.params.userId;
    if (!id || !currentUserId)
      return res.status(400).json({ message: "All fields are required" });
    const messages = await Message.find({
      $or: [
        { sender: id, receiver: currentUserId },
        { sender: currentUserId, receiver: id },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: "Error get messages",
      ...(process.env !== "production" && { error: error.message }),
    });
  }
};

const sentMessage = async (req, res, io) => {
  const sender = req.user.id;
  const { receiver, content } = req.body;
  try {
    if (!sender || !receiver || !content)
      return res.status(400).json({ message: "All fields are required" });

    const message = await Message.create({ sender, receiver, content });
    io.to(receiver).emit("receivedMessage", { sender, content });
    io.to(sender).emit("receivedMessage", { sender, content });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({
      message: "Error send message",
      ...(process.env !== "production" && { error: error.message }),
    });
  }
};

module.exports = { getMessages, sentMessage };
