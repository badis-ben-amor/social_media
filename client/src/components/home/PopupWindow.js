import React, { useEffect, useRef, useState } from "react";
import { Button, Card, FormControl } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getMessagesThunk,
  sentMessageThunk,
} from "../../redux/slices/messageSlice";
import { onMessageReceived, sendMessage } from "../../services/socketService";
import img01 from "../../assets/01.avif";

const PopupWindow = ({ user, onclose }) => {
  const dispatch = useDispatch();
  const messagesEndRef = useRef();

  const { messages: messagesData } = useSelector((state) => state.message);
  const { accessToken } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.profile);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (user) {
      dispatch(getMessagesThunk({ accessToken, currentUserId: user._id }));
    }
  }, [user, profile._id, dispatch]);

  useEffect(() => {
    setMessages(messagesData);
  }, [messagesData]);

  useEffect(() => {
    onMessageReceived((newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    });
  }, []);

  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };

    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        sender: profile._id,
        receiver: user._id,
        content: newMessage.trim(),
      };

      sendMessage(messageData);

      dispatch(
        sentMessageThunk({
          accessToken,
          receiver: user._id,
          content: newMessage.trim(),
        })
      );

      setMessages((prev) => [...prev, messageData]);
      setNewMessage("");
    }
  };

  return (
    <Card
      style={{
        width: "300px",
        position: "fixed",
        bottom: "10px",
        right: "10px",
        zIndex: 1000,
      }}
    >
      <Card.Body>
        <div className="d-flex align-items-center">
          <img
            src={img01}
            alt={user.name}
            style={{ width: "50px", borderRadius: "50px", marginRight: "10px" }}
          />
          <h6>{user.name}</h6>
          <Button
            variant="danger"
            size="sm"
            onClick={onclose}
            style={{ position: "absolute", top: "5px", right: "5px" }}
          >
            &times;
          </Button>
        </div>
        <div
          style={{
            maxHeight: "200px",
            overflow: "auto",
            marginTop: "10px",
            border: "1px solid #ddd",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                textAlign: msg.sender === profile._id ? "right" : "left",
                marginBottom: "20px ",
              }}
            >
              <span
                style={{
                  display: "initial-block",
                  padding: "5px 10px",
                  borderRadius: "10px",
                  backgroundColor:
                    msg.sender === profile._id ? "#007bff" : "#f1f1f1",
                  color: msg.sender === profile._id ? "#fff" : "#000",
                }}
              >
                {msg.content}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>
        <FormControl
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <Button
          size="sm"
          onClick={handleSendMessage}
          style={{ marginTop: "10px", width: "100%" }}
        >
          Send
        </Button>
      </Card.Body>
    </Card>
  );
};

export default PopupWindow;
