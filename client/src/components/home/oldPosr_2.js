import React, { useEffect, useState } from "react";
import { Card, Button, Modal, Form, Container } from "react-bootstrap";
import img01 from "../../assets/01.avif";
import { useDispatch, useSelector } from "react-redux";
import { getPostsThunk } from "../../redux/slices/postSlice";
import { addLikeThunk, deleteLikeThunk } from "../../redux/slices/likeSlice";
import {
  getCommentsThunk,
  createCommentThunk,
  updateCommentThunk,
  deleteCommentThunk,
} from "../../redux/slices/commentSlice";
// import img02 from "../../assets/im2.jpg";

const Post = () => {
  const dispatch = useDispatch();
  const { profile, isLoading, error } = useSelector((state) => state.profile);
  const { accessToken } = useSelector((state) => state.auth);
  const { posts: postsData } = useSelector((state) => state.post);
  const { isLoadCommintCreat } = useSelector((state) => state.comment);

  // post states
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  // comment states
  const [showModal, setShowModal] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [editComment, setEditComment] = useState(null);

  // post logic
  useEffect(() => {
    dispatch(getPostsThunk());
  }, [dispatch]);

  useEffect(() => {
    setPosts(postsData);
    setSelectedPost(postsData.find((p) => p?._id === selectedPost?._id));
  }, [postsData]);

  // comment logic
  const handleLikeButton = (postId, post, profile) => {
    const existingLike = post.likes.find((like) => like.user === profile._id);
    if (!existingLike) {
      dispatch(addLikeThunk({ postId, accessToken })).then(() =>
        dispatch(getPostsThunk())
      );
    } else {
      dispatch(
        deleteLikeThunk({ postId, accessToken, likeId: existingLike._id })
      ).then(() => dispatch(getPostsThunk()));
    }
  };

  const handleOpenModal = (post) => {
    setSelectedPost(post);
    setShowModal(true);
    setEditComment(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCommentContent("");
    setEditComment(null);
  };

  const handleAddComment = (post) => {
    if (commentContent.trim()) {
      dispatch(
        createCommentThunk({
          postId: post._id,
          content: commentContent,
          accessToken,
        })
      ).then(() => {
        setCommentContent("");
        dispatch(getPostsThunk());
      });
    }
  };

  const handleEditeComment = (comment) => {
    setCommentContent(comment.comment.content);
    setEditComment(comment);
  };

  const handleSaveEditComment = (postId) => {
    if (commentContent.trim() && editComment) {
      dispatch(
        updateCommentThunk({
          postId,
          commentId: editComment.comment._id,
          content: commentContent,
          accessToken,
        })
      ).then(() => {
        setCommentContent("");
        setEditComment(null);
        dispatch(getPostsThunk());
      });
    }
  };

  const handleDeleteComment = (comment, postId) => {
    dispatch(
      deleteCommentThunk({
        postId,
        commentId: comment.comment._id,
        accessToken,
      })
    ).then(() => dispatch(getPostsThunk()));
  };

  return (
    <Container>
      {/* post jsx */}
      {posts ? (
        posts.map((post) => (
          <Card
            key={post._id}
            className="mb-3"
            style={{ backgroundColor: "#f8f7fa" }}
          >
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
                  src={post.image}
                  alt="Post Image"
                  className="img-fluid rounded mb-2"
                  // crossOrigin="anonymous"
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
                <Button
                  variant="outline-secondary"
                  onClick={() => handleOpenModal(post)}
                >
                  <i className="bi bi-chat"></i> {post?.comments?.length}{" "}
                  Comments
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))
      ) : (
        <h4 className="text-center mt-5">Not posts found</h4>
      )}

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
              <h5>{selectedPost?.user?.name}</h5>
            </div>
            <small className="text-muted">
              {new Date(selectedPost?.createdAt).toLocaleString()}
            </small>
            <p>{selectedPost?.content}</p>
            {selectedPost?.image && (
              <img
                src={selectedPost?.image}
                alt="Post Image"
                className="img-fluid mb-3"
              />
            )}
            <hr />
            <div>
              {selectedPost?.comments?.map((comment) => (
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
                    style={{
                      backgroundColor: "#d7e4f7",
                      borderRadius: "8px",
                    }}
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
                        onClick={() =>
                          handleDeleteComment(comment, selectedPost?._id)
                        }
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
                disabled={isLoadCommintCreat}
              />
              {editComment ? (
                <Button
                  onClick={() => handleSaveEditComment(selectedPost?._id)}
                  variant="primary"
                >
                  Save Edit
                </Button>
              ) : (
                <Button
                  disabled={isLoadCommintCreat}
                  onClick={() => handleAddComment(selectedPost)}
                  variant="primary"
                >
                  Add Comment
                </Button>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Post;
