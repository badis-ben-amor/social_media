import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import img01 from "../../assets/01.avif";
import { useDispatch, useSelector } from "react-redux";
import { addLikeThunk, deleteLikeThunk } from "../../redux/slices/likeSlice";
import {
  createCommentThunk,
  deleteCommentThunk,
  getCommentsThunk,
  updateCommentThunk,
} from "../../redux/slices/commentSlice";

const Post = ({ post }) => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.profile);
  const { accessToken } = useSelector((state) => state.auth);
  const comments = useSelector((state) => state.comment.comments); // Assuming you've set up Redux for comments

  const [showModal, setShowModal] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [editComment, setEditComment] = useState(null);

  useEffect(() => {
    if (showModal) {
      dispatch(getCommentsThunk(post._id)); // Fetch comments when modal opens
    }
  }, [showModal, post._id, dispatch]);

  const handleLikeButton = (postId, post, profile) => {
    const existingLike = post.likes.find((like) => like.user === profile._id);
    if (!existingLike) {
      dispatch(addLikeThunk({ postId, accessToken }));
    } else {
      dispatch(
        deleteLikeThunk({ postId, accessToken, likeId: existingLike._id })
      );
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
    setEditComment(null); // Clear any existing edits
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCommentContent("");
    setEditComment(null);
  };

  const handleAddComment = () => {
    if (commentContent.trim()) {
      dispatch(
        createCommentThunk({
          postId: post._id,
          content: commentContent,
          accessToken,
        })
      );
      setCommentContent("");
    }
  };

  const handleEditComment = (commentId) => {
    const commentToEdit = comments.find((comment) => comment._id === commentId);
    setCommentContent(commentToEdit.content);
    setEditComment(commentToEdit);
  };

  const handleSaveEditComment = () => {
    if (commentContent.trim() && editComment) {
      dispatch(
        updateCommentThunk({
          commentId: editComment._id,
          content: commentContent,
          accessToken,
        })
      );
      setCommentContent("");
      setEditComment(null);
    }
  };

  const handleDeleteComment = (commentId) => {
    dispatch(deleteCommentThunk({ commentId, accessToken }));
  };

  return (
    <Card className="mb-3">
      <Card.Header className="d-flex align-items-center">
        <img
          src={img01}
          alt="User Avatar"
          className="rounded-circle me-2"
          style={{ width: "50px", height: "50px" }}
        />
        <div>
          <h5 className="mb-0">{post.user.name}</h5>
          <small className="text-muted">
            {new Date(post.createdAt).toLocaleString()}
          </small>
        </div>
      </Card.Header>
      <Card.Body>
        <Card.Text>{post.content}</Card.Text>
        {post.image && (
          <img
            src={`${process.env.REACT_APP_API_URL}/uploads/${post.image}`}
            alt="Post"
            className="img-fluid rounded mb-2"
          />
        )}
        <div className="d-flex justify-content-between">
          <Button
            onClick={() => handleLikeButton(post._id, post, profile)}
            variant={`${
              post.likes.some((like) => like.user === profile._id)
                ? "primary"
                : "outline-primary"
            }`}
            className="me-2"
          >
            Like {post?.likes?.length}
          </Button>
          <Button variant="outline-secondary" onClick={handleOpenModal}>
            Comments {post?.comments?.length}
          </Button>
        </div>
      </Card.Body>

      {/* Comments Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Comments on Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <h5>{post.user.name}</h5>
            <p>{post.content}</p>
            {post.image && (
              <img
                src={`${process.env.REACT_APP_API_URL}/uploads/${post.image}`}
                alt="Post Image"
                className="img-fluid mb-3"
              />
            )}
            <div className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Add a comment..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              />
              {editComment ? (
                <Button
                  onClick={handleSaveEditComment}
                  className="mt-2"
                  variant="primary"
                >
                  Save Edit
                </Button>
              ) : (
                <Button
                  onClick={handleAddComment}
                  className="mt-2"
                  variant="primary"
                >
                  Add Comment
                </Button>
              )}
            </div>
            <hr />
            <div>
              {comments.map((comment) => (
                <div key={comment._id} className="mb-2">
                  <div>{comment.content}</div>
                  <small className="text-muted">By {comment.user.name}</small>
                  <div className="d-flex justify-content-between">
                    <Button
                      variant="link"
                      onClick={() => handleEditComment(comment._id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="link"
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default Post;
