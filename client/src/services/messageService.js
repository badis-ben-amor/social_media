import axios from "axios";

export const getMessages = async ({ accessToken, currentUserId }) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/message/${currentUserId}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return res;
};

export const sentMessage = async ({ accessToken, receiver, content }) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/message`,
    { receiver, content },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return res;
};
