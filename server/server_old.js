const dotenv = require("dotenv");
const express = require("express");
const mongoConnection = require("./config/db");
// middlewares
const cors = require("cors");
const cookieParser = require("cookie-parser");
// socket.io
// const { Server } = require("socket.io");
// const http = require("http");
const socketEvents = require("./socket");
// public routes
const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");
// user routes
const userRoutes = require("./routes/userRoutes");
const postsRoutes = require("./routes/postsRoutes");
const likeRoutes = require("./routes/likeRoutes");
const commentRoutes = require("./routes/commentRoutes");
const messageRoutes = require("./routes/messageRoutes");

dotenv.config();
mongoConnection();
const app = express();
// const server = http.createServer(app);
// set up socket.io instance with server
// const io = new Server(server, {
//   cors: {
//     origin: process.env.CLIENT_URL,
//     credentials: true,
//   },
// });
// attach io instance to the request object
// app.use((req, res, next) => {
//   res.io = io;
//   next;
// });
// set up socket events
// socketEvents(io);

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());

// public routes
app.use("/auth", authRoutes);
app.use("/post", postsRoutes);
app.use("/uploads", fileRoutes);
// user routes
app.use("/profile", userRoutes);
app.use("/like", likeRoutes);
app.use("/comment", commentRoutes);
app.use("/message", messageRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server runnig on port ${PORT}`);
});
