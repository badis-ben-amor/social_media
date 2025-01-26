import axios from "axios";

export const getComments = async () => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/comment`);
  return res;
};

export const createComment = async (postId, content, accessToken) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/comment`,
    { content, postId },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return res;
};

export const updateComment = async ({
  postId,
  content,
  commentId,
  accessToken,
}) => {
  const res = await axios.put(
    `${process.env.REACT_APP_API_URL}/comment`,
    {
      postId,
      commentId,
      content,
    },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return res;
};

export const deleteComment = async ({ postId, commentId, accessToken }) => {
  const res = await axios.delete(`${process.env.REACT_APP_API_URL}/comment`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { postId, commentId },
  });
  return res;
};
