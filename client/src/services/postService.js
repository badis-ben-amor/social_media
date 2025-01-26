import axios from "axios";

export const getPosts = async () => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/post`);
  return res;
};

export const createPost = async ({ content, accessToken }) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/post`,
    { content },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return res;
};

export const editPost = async ({ postId, content, accessToken }) => {
  const res = await axios.put(
    `${process.env.REACT_APP_API_URL}/post`,
    { content, postId },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return res;
};

export const deletePost = async ({ postId, accessToken }) => {
  const res = await axios.delete(`${process.env.REACT_APP_API_URL}/post`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { postId },
  });
  return res;
};
