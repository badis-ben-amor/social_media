import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAllUsersAdmin,
  createUserAdmin,
  updateUserAdmin,
  deleteUserAdmin,
} from "../../../services/admin/userServiceAdmin";
import { refresh } from "../../../services/authService";

export const getAllUsersAdminThunk = createAsyncThunk(
  "adminUser/getAllUsers",
  async (accessToken, thunkAPI) => {
    try {
      const res = await getAllUsersAdmin(accessToken);
    } catch (error) {
      if (error.response?.status === 403) {
        const { newAccessToken } = await refresh();
        if (newAccessToken) {
          const retryRes = await getAllUsersAdmin(newAccessToken);
          return retryRes.data;
        }
      }
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createUserAdminThunk = createAsyncThunk(
  "adminUser/createUser",
  async ({ accessToken, name, email, password, isAdmin }, thunkAPI) => {
    try {
      const res = await createUserAdmin({
        accessToken,
        name,
        email,
        password,
        isAdmin,
      });
    } catch (error) {
      if (error.response?.status === 403) {
        const { newAccessToken } = await refresh();
        if (newAccessToken) {
          try {
            const retryRes = await createUserAdmin({
              accessToken: newAccessToken,
              name,
              email,
              password,
              isAdmin,
            });
            return retryRes.data;
          } catch (error) {
            return thunkAPI.rejectWithValue(
              error?.response?.data?.message || "Error creating user"
            );
          }
        }
      }
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Error creating user"
      );
    }
  }
);

export const updateUserAdminThunk = createAsyncThunk(
  "adminUser/updateUser",
  async ({ accessToken, name, email, isAdmin, userId }, thunkAPI) => {
    try {
      const res = await updateUserAdmin({
        accessToken,
        name,
        email,
        isAdmin,
        userId,
      });
    } catch (error) {
      if (error.response?.status === 403) {
        const { newAccessToken } = await refresh();
        if (newAccessToken) {
          const retryRes = await updateUserAdmin({
            accessToken: newAccessToken,
            name,
            email,
            isAdmin,
            userId,
          });
          return retryRes.data;
        }
      }
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteUserAdminThunk = createAsyncThunk(
  "adminUser/deleteUser",
  async ({ accessToken, userId }, thunkAPI) => {
    try {
      const res = await deleteUserAdmin({ accessToken, userId });
    } catch (error) {
      if (error.response?.status === 403) {
        const { newAccessToken } = await refresh();
        if (newAccessToken) {
          const retryRes = await deleteUserAdmin({
            accessToken: newAccessToken,
            userId,
          });
          return retryRes.data;
        }
      }
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

const adminUserSlice = createSlice({
  name: "adminUser",
  initialState: {
    users: [],
    user: {},
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsersAdminThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsersAdminThunk.fulfilled, (state, action) => {
        state.isLoading = true;
        state.users = action.payload;
      })
      .addCase(getAllUsersAdminThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createUserAdminThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createUserAdminThunk.fulfilled, (state, action) => {
        state.isLoading = true;
        state.user = action.payload;
      })
      .addCase(createUserAdminThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateUserAdminThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserAdminThunk.fulfilled, (state, action) => {
        state.isLoading = true;
        state.user = action.payload;
      })
      .addCase(updateUserAdminThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteUserAdminThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUserAdminThunk.fulfilled, (state, action) => {
        state.isLoading = true;
        state.user = action.payload;
      })
      .addCase(deleteUserAdminThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default adminUserSlice.reducer;
