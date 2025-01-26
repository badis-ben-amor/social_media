import React, { useEffect, useState } from "react";
import Post from "../components//home/Post";
import CreatePost from "../components/home/CreatePost";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getPostsThunk } from "../redux/slices/postSlice";
import UsersList from "../components/home/UsersList";
import PopupWindow from "../components/home/PopupWindow";

// import img02 from "../assets/im2.jpg";

const Home = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.post);

  const [postsData, setPostsData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(getPostsThunk());
  }, [dispatch]);

  useEffect(() => {
    setPostsData(posts);
  }, [posts]);

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
      <Col md3></Col>

      <Col md={6}>
        <div className="home-page">
          {/* <h2 className="mb-4 text-center mt-5">Home</h2> */}
          <CreatePost />
          {postsData ? (
            postsData.map((post, i) => (
              <Post key={i} post={post} updatePosts={updatePosts} />
            ))
          ) : (
            <h4 className="text-center mt-5">Not posts found</h4>
          )}
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
