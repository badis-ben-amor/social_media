import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createPostThunk } from "../../redux/slices/postSlice";

const CreatePost = () => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);

  const [content, setContent] = useState("");
  // const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("Content can not be empty.");
      return;
    }
    dispatch(createPostThunk({ content, accessToken }));
  };

  return (
    <Card className="my-4" style={{ backgroundColor: "#f8f7fa" }}>
      <Card.Body>
        <h5>Create a Post</h5>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Image (optional)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              // onChange={(e) => setImage(e.target.files[0])}
            />
          </Form.Group>
          <Button type="submit" variant="primary">
            Post
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CreatePost;
