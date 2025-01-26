import io from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL, { withCredentials: false });

const joinRoom = (userId) => {
  socket.emit("joinRoom", userId);
};

const sendMessage = (data) => {
  socket.emit("sendMessage", data);
};

const onMessageReceived = (callback) => {
  socket.on("receivedMessage", callback);
};

export { socket, joinRoom, sendMessage, onMessageReceived };
