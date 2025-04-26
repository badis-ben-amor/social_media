import axios from "axios";

export const login = async (userData) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/auth/login`,
    {
      userData,
    },
    { withCredentials: true }
  );
  return res;
};

export const register = async (userData) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/auth/register`,
    { userData },
    { withCredentials: true }
  );
  return res;
};

export const refresh = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/auth/refresh`,
    { refreshToken },
    { withCredentials: true }
  );
  return res.data;
};

export const logout = async () => {
  localStorage.clear("refreshToken");
  return;
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/auth/logout`,
    {},
    { withCredentials: true }
  );
  return res;
};
