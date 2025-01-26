import axios from "axios";

export const getAllUsers = async () => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/allUsers`);
  return res;
};
