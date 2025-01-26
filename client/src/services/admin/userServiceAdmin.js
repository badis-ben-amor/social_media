import axios from "axios";

export const getAllUsersAdmin = async (accessToken) => {
  const res = await axios.get(`${process.env.REACT_APP_API_URL}/adminUser`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res;
};

export const createUserAdmin = async ({
  accessToken,
  name,
  email,
  password,
  isAdmin,
}) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/adminUser`,
    { name, email, password, isAdmin },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return res;
};

export const updateUserAdmin = async ({
  accessToken,
  userId,
  name,
  email,
  isAdmin,
}) => {
  const res = await axios.put(
    `${process.env.REACT_APP_API_URL}/adminUser/${userId}`,
    { name, email, isAdmin },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return res;
};

export const deleteUserAdmin = async ({ accessToken, userId }) => {
  const res = await axios.delete(
    `${process.env.REACT_APP_API_URL}/adminUser/${userId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return res;
};
