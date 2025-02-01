import axios from "axios";

export const login = async (userData) => {
  const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
    userData,
  });
  return res;
};

export const register = async (userData) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/auth/register`,
    { userData }
  );
  return res;
};

export const refresh = async () => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/auth/refresh`,
    {}
    // { withCredentials: true }
  );
  return res.data;
};

export const logout = async () => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/auth/logout`,
    {},
    { withCredentials: true }
  );
  return res;
};
