import React, { useState } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import img01 from "../../assets/01.avif";
import { useDispatch, useSelector } from "react-redux";
import { addLikeThunk, deleteLikeThunk } from "../../redux/slices/likeSlice";
import { getPostsThunk } from "../../redux/slices/postSlice";
import {
  getCommentsThunk,
  createCommentThunk,
  updateCommentThunk,
  deleteCommentThunk,
} from "../../redux/slices/commentSlice";

const Post = ({ post, updatePosts }) => {
  const dispatch = useDispatch();
  const { profile, isLoading, error } = useSelector((state) => state.profile);
  const { accessToken } = useSelector((state) => state.auth);

  console.log(post);

  const [showModal, setShowModal] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [editComment, setEditComment] = useState(null);

  const handleLikeButton = (postId, post, profile) => {
    const existingLike = post.likes.find((like) => like.user === profile._id);
    if (!existingLike) {
      dispatch(addLikeThunk({ postId, accessToken })).then(() => updatePosts());
    } else {
      dispatch(
        deleteLikeThunk({ postId, accessToken, likeId: existingLike._id })
      ).then(() => updatePosts());
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
    setEditComment(null);
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
      ).then(() => {
        setCommentContent("");
        updatePosts();
      });
    }
  };

  const handleEditeComment = (comment) => {
    setCommentContent(comment.comment.content);
    setEditComment(comment);
  };

  const handleSaveEditComment = () => {
    if (commentContent.trim() && editComment) {
      dispatch(
        updateCommentThunk({
          postId: post._id,
          commentId: editComment.comment._id,
          content: commentContent,
          accessToken,
        })
      ).then(() => {
        setCommentContent("");
        setEditComment(null);
        updatePosts();
      });
    }
  };

  const handleDeleteComment = (comment) => {
    dispatch(
      deleteCommentThunk({
        postId: post._id,
        commentId: comment.comment._id,
        accessToken,
      })
    ).then(() => updatePosts());
  };

  return (
    <Card className="mb-3" style={{ backgroundColor: "#f8f7fa" }}>
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
            <i className="bi bi-hand-thumbs-up"></i> {post?.likes?.length}
          </Button>
          <Button variant="outline-secondary" onClick={handleOpenModal}>
            <i className="bi bi-chat"></i> {post?.comments?.length} Comments
          </Button>
        </div>
      </Card.Body>

      {/* comments model */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton className="sticky-top">
          <Modal.Title>Comments on post</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column" style={{ height: "85vh" }}>
          <div className="flex-grow-1 overflow-auto">
            <div className="d-flex">
              <img
                src={img01}
                alt="User Avatar"
                className="rounded-circle me-2"
                style={{ width: "35px", height: "35px" }}
              />
              <h5>{post.user.name}</h5>
            </div>
            <small className="text-muted">
              {new Date(post.createdAt).toLocaleString()}
            </small>
            <p>{post.content}</p>
            {post.image && (
              <img
                src={`${process.env.REACT_APP_API_URL}/uploads/${post.image}`}
                alt="Post Image"
                className="img-fluid mb-3"
              />
            )}
            <hr />
            <div>
              {post.comments.map((comment) => (
                <div
                  key={comment._id}
                  className="mb-2"
                  style={{
                    borderRadius: "8px",
                    backgroundColor: `${
                      comment.user._id === profile._id ? "#e9ebe4" : ""
                    }`,
                  }}
                >
                  <div className="d-flex">
                    <img
                      src={img01}
                      alt="User Avatar"
                      className="rounded-circle me-2"
                      style={{ width: "25px", height: "25px" }}
                    />
                    <h6>{comment.user.name}</h6>
                  </div>
                  <span
                    style={{ backgroundColor: "#d7e4f7", borderRadius: "8px" }}
                    className="text-muted px-2"
                  >
                    {comment.comment?.content}
                  </span>
                  {comment.user._id === profile._id ? (
                    <div className="d-flex justify-content-between">
                      <Button
                        variant="link"
                        onClick={() => handleEditeComment(comment)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="link"
                        onClick={() => handleDeleteComment(comment)}
                      >
                        Delete
                      </Button>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-between">
                      <Button variant="link"></Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="bg-white sticky-bottom">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Add a comment..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              />
              {editComment ? (
                <Button onClick={handleSaveEditComment} variant="primary">
                  Save Edit
                </Button>
              ) : (
                <Button onClick={handleAddComment} variant="primary">
                  Add Comment
                </Button>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default Post;
