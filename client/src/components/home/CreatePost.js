import React, { useState } from "react";
import { Form, Button, Card, Container, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createPostThunk } from "../../redux/slices/postSlice";

const CreatePost = ({ updatePosts }) => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);
  const { isLoadCreate } = useSelector((state) => state.post);

  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", content);
    image && formData.append("image", image);
    dispatch(createPostThunk({ formData, accessToken })).then(() => {
      updatePosts();
      setContent("");
      setImage(null);
    });
  };

  return (
    <Container>
      <Card className="my-4" style={{ backgroundColor: "#f8f7fa" }}>
        <Card.Body>
          {isLoadCreate && (
            <div className="text-center">
              <Spinner />
            </div>
          )}
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
                onChange={(e) => setImage(e.target.files[0])}
              />
            </Form.Group>
            {image && (
              <div>
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                    margin: "8px",
                  }}
                />
                <p variant="caption" display="block" sx={{ ml: 1 }}>
                  {image.name}
                </p>
              </div>
            )}
            <Button disabled={isLoadCreate} type="submit" variant="primary">
              Create Post
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreatePost;
