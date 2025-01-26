import axios from "axios";

export const getProfile = async (accessToken) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/profile`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
    { withCredentials: true }
  );
  return res.data;
};
