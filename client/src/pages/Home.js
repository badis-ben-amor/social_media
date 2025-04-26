import React, { useEffect, useState } from "react";
import Post from "../components//home/Post";
import CreatePost from "../components/home/CreatePost";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getPostsThunk } from "../redux/slices/postSlice";
import UsersList from "../components/home/UsersList";
import PopupWindow from "../components/home/PopupWindow";
import { getProfileThunk } from "../redux/slices/profileSlice";

const Home = () => {
  const dispatch = useDispatch();

  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(getProfileThunk(""));
  }, []);

  const updatePosts = (type) => {
    dispatch(getPostsThunk());
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleClosePopup = () => {
    setSelectedUser(null);
  };

  return (
    <Container className="d-flex justify-content-center">
      <Col md={3}></Col>

      <Col md={6}>
        <div className="home-page">
          <CreatePost updatePosts={updatePosts} />
          <Post />
        </div>
      </Col>

      <Col md={3}>
        <UsersList onUserClick={handleUserClick} />
      </Col>
      {selectedUser && (
        <PopupWindow
          user={selectedUser}
          onclose={handleClosePopup}
        ></PopupWindow>
      )}
    </Container>
  );
};

export default Home;
