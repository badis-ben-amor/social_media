import axios from "axios";

export const addLike = async (accessToken, postId) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/like`,
    { postId },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return res;
};

export const deleteLike = async (postId, likeId, accessToken) => {
  const res = axios.delete(`${process.env.REACT_APP_API_URL}/like`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { postId, likeId },
  });
  return res;
};
