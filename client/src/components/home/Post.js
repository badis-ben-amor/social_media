import React, { useEffect, useRef, useState } from "react";
import { Card, Button, Modal, Form, Container, Spinner } from "react-bootstrap";
import img01 from "../../assets/01.avif";
import { useDispatch, useSelector } from "react-redux";
import {
  getPostsThunk,
  editPostThunk,
  deletePostThunk,
} from "../../redux/slices/postSlice";
import { addLikeThunk, deleteLikeThunk } from "../../redux/slices/likeSlice";
import {
  getCommentsThunk,
  createCommentThunk,
  updateCommentThunk,
  deleteCommentThunk,
} from "../../redux/slices/commentSlice";
import {
  Pencil,
  Trash,
  ExclamationTriangleFill,
  CardImage,
} from "react-bootstrap-icons";

const Post = () => {
  const dispatch = useDispatch();
  const { profile, isLoading, error } = useSelector((state) => state.profile);
  // const { accessToken } = useSelector((state) => state.auth);
  const accessToken = localStorage.getItem("accessToken");
  const {
    posts: postsData,
    isLoadEdit,
    isLoadDelete,
  } = useSelector((state) => state.post);
  const { isLoadCommintCreat } = useSelector((state) => state.comment);

  // post states
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editPost, setEditPost] = useState(false);
  const [editedImage, setEditedImage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idDeletePost, setIdDeletePost] = useState("");

  // comment states
  const [showModal, setShowModal] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [editComment, setEditComment] = useState(null);
  // -scroll
  const commentsContainerRef = useRef(null);
  const lastCommentRef = useRef(null);

  // post effects
  useEffect(() => {
    dispatch(getPostsThunk());
  }, [dispatch]);

  useEffect(() => {
    setPosts(postsData);
    setSelectedPost(postsData?.find((p) => p?._id === selectedPost?._id));
  }, [postsData]);

  const textareaRef = useRef();
  useEffect(() => {
    if (textareaRef.current) {
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [selectedPost?.content]);

  // comment effects
  useEffect(() => {
    if (!editPost) {
      lastCommentRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedPost?.comments]);

  // post logic
  const handleShowEditModal = (post) => {
    setShowModal(true);
    setSelectedPost(post);
    setEditPost(true);
  };

  const handleSaveEditPost = () => {
    setShowModal(false);
    const formData = new FormData();
    formData.append("content", selectedPost.content);
    formData.append("postId", selectedPost._id);
    editedImage && formData.append("image", editedImage);
    dispatch(editPostThunk({ formData, accessToken })).then(() => {
      dispatch(getPostsThunk());
      setSelectedPost(null);
      setEditedImage("");
    });
  };

  const handleShowDeleteModal = (postId) => {
    setIdDeletePost(postId);
    setShowDeleteModal(true);
  };

  const handleDetePost = (postId) => {
    setShowDeleteModal(false);
    dispatch(deletePostThunk({ postId, accessToken })).then(() =>
      dispatch(getPostsThunk())
    );
  };

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
    // edit post
    setEditPost(false);
    setEditedImage("");
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
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div className="d-flex">
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
              </div>
              {profile._id === post.user._id && (
                <div>
                  <Pencil
                    style={{ cursor: "pointer" }}
                    onClick={() => handleShowEditModal(post)}
                  />
                  <Trash
                    style={{ cursor: "pointer" }}
                    onClick={() => handleShowDeleteModal(post._id)}
                    className="ms-3"
                  />
                </div>
              )}
            </Card.Header>
            <Card.Body>
              {isLoadDelete && idDeletePost === post._id && (
                <div className="text-center">
                  <Spinner
                    style={{ fontSize: "10px", height: "20px", width: "20px" }}
                  />
                </div>
              )}
              {isLoadEdit && selectedPost?._id === post._id && (
                <div className="text-center">
                  <Spinner />
                </div>
              )}
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
          <Modal.Title>
            {editPost ? "Edit Post" : "Comments on post"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column" style={{ height: "80vh" }}>
          <div className="flex-grow-1 overflow-auto" ref={commentsContainerRef}>
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
            <div className="d-flex">
              {editPost ? (
                <div className="m-2 w-100 d-flex justify-content-between">
                  <textarea
                    rows={3}
                    cols={25}
                    autoFocus
                    ref={textareaRef}
                    onChange={(e) =>
                      setSelectedPost((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    value={selectedPost?.content}
                  />

                  <div>
                    <label style={{ cursor: "pointer" }}>
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          setEditedImage(e.target.files[0]);
                        }}
                      />
                      Change Image <CardImage />
                    </label>
                    {editedImage && (
                      <div>
                        <img
                          src={URL.createObjectURL(editedImage)}
                          alt="preview"
                          style={{
                            width: "70px",
                            height: "70px",
                            objectFit: "cover",
                            margin: "8px",
                          }}
                        />
                        {editedImage.name.length > 15
                          ? `${editedImage.name.slice(0, 15)}...`
                          : editedImage.name}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p>{selectedPost?.content}</p>
              )}
            </div>
            {editPost && (
              <Button onClick={handleSaveEditPost} className="w-100 my-2">
                Save change
              </Button>
            )}
            {selectedPost?.image && (
              <img
                src={selectedPost?.image}
                alt="Post Image"
                className="img-fluid mb-3"
              />
            )}
            {!editPost && (
              <>
                <hr />
                <div>
                  {selectedPost?.comments?.map((comment, index) => (
                    <div
                      key={comment._id}
                      ref={
                        index === selectedPost.comments.length - 1
                          ? lastCommentRef
                          : null
                      }
                      className="mb-2"
                      style={{
                        borderRadius: "8px",
                        backgroundColor:
                          comment.user._id === profile._id ? "#e9ebe4" : "",
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
                  {!editPost && (
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Add a comment..."
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      disabled={isLoadCommintCreat}
                    />
                  )}
                  {editComment ? (
                    <Button
                      onClick={() => handleSaveEditComment(selectedPost?._id)}
                      variant="primary"
                    >
                      Save Edit
                    </Button>
                  ) : editPost ? (
                    <Button>Save</Button>
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
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>

      {/* Delete Post Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <ExclamationTriangleFill className="text-warning me-2" />
            Delete Confirmation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure to delete this post</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowDeleteModal(false)} variant="secondary">
            Cancel
          </Button>
          <Button onClick={() => handleDetePost(idDeletePost)} variant="danger">
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Post;
