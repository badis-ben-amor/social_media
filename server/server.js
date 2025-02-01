const dotenv = require("dotenv");
const express = require("express");
dotenv.config();
const mongoConnection = require("./config/db");
// middlewares
const cors = require("cors");
const cookieParser = require("cookie-parser");
// socket.io
const { Server } = require("socket.io");
const http = require("http");
// const socketEvents = require("./socket");
// public routes
const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");
const allUsersRoutes = require("./routes/allUsersRoutes");
// user routes
const userRoutes = require("./routes/userRoutes");
const postsRoutes = require("./routes/postsRoutes");
const likeRoutes = require("./routes/likeRoutes");
const commentRoutes = require("./routes/commentRoutes");
const messageRoutes = require("./routes/messageRoutes");
// admin routes
const userRoutesAdmin = require("./routes/admin/userRoutesAdmin");

mongoConnection();
const app = express();
const server = http.createServer(app);
// set up socket.io instance with server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    // credentials: true,
  },
});

// attach io instance to the request object
// app.use((req, res, next) => {
//   res.io = io;
//   next;
// });
// set up socket events
// socketEvents(io);

//
// socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected with id: ", socket.id);

  // join a user-specific room
  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // handle sending messages
  socket.on("sendMessage", (data) => {
    const { sender, receiver, content } = data;

    // emit message to the receiver's room
    // io.to(receiver).emit("receivedMessage", { sender, content });
    // io.to(sender).emit("receivedMessage", { sender, content });

    console.log(`Message from ${sender} to ${receiver}: ${content}`);
  });

  socket.on("disconnect", () => {
    console.log("A user discoonected: ", socket.id);
  });
});

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

app.set("io", io);
// public routes
app.use("/auth", authRoutes);
app.use("/post", postsRoutes);
app.use("/uploads", fileRoutes);
app.use("/allUsers", allUsersRoutes);
// user routes
app.use("/profile", userRoutes);
app.use("/like", likeRoutes);
app.use("/comment", commentRoutes);
app.use("/message", messageRoutes);
// admin routes
app.use("/adminUser", userRoutesAdmin);
// test
app.get("/", (req, res) => {
  res.send("Server is running  f!");
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server runnig on port ${PORT}`);
});
