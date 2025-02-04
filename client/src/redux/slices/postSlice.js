import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getPosts,
  createPost,
  editPost,
  deletePost,
} from "../../services/postService";
import { refresh } from "../../services/authService";

export const getPostsThunk = createAsyncThunk(
  "post/getPosts",
  async (_, thunkAPI) => {
    try {
      const res = await getPosts();
      return res.data;
    } catch (error) {
      thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createPostThunk = createAsyncThunk(
  "post/create",
  async ({ formData, accessToken }, thunkAPI) => {
    try {
      const res = await createPost({ formData, accessToken });
      return res.data;
    } catch (error) {
      if (error.response?.status === 403) {
        const { newAccessToken } = await refresh();
        if (newAccessToken) {
          const createPostAgain = await createPost({
            formData,
            accessToken: newAccessToken,
          });
          return createPostAgain.data;
        }
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
    }
  }
);

export const editPostThunk = createAsyncThunk(
  "post/edit",
  async ({ formData, accessToken }, thunkAPI) => {
    try {
      const res = await editPost({ formData, accessToken });
      return res.data;
    } catch (error) {
      if (error.response?.status === 403) {
        const { newAccessToken } = await refresh();
        if (newAccessToken) {
          const editPostAgain = await editPost({
            formData,
            accessToken: newAccessToken,
          });
          return editPostAgain.data;
        }
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
    }
  }
);

export const deletePostThunk = createAsyncThunk(
  "post/delet",
  async ({ postId, accessToken }, thunkAPI) => {
    try {
      const res = await deletePost({ postId, accessToken });
      return res.data;
    } catch (error) {
      if (error.response?.status === 403) {
        const { newAccessToken } = await refresh();
        if (newAccessToken) {
          const deletePostAgain = await deletePost({
            postId,
            accessToken: newAccessToken,
          });
          return deletePostAgain.data;
        }
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
    }
  }
);

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    post: {},
    isLoading: false,
    isLoadCreate: false,
    isLoadEdit: false,
    isLoadDelete: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPostsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPostsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(getPostsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createPostThunk.pending, (state) => {
        state.isLoadCreate = true;
      })
      .addCase(createPostThunk.fulfilled, (state) => {
        state.isLoadCreate = false;
      })
      .addCase(createPostThunk.rejected, (state, action) => {
        state.isLoadCreate = false;
        state.error = action.payload;
      })
      .addCase(editPostThunk.pending, (state) => {
        state.isLoadEdit = true;
      })
      .addCase(editPostThunk.fulfilled, (state) => {
        state.isLoadEdit = false;
      })
      .addCase(editPostThunk.rejected, (state, action) => {
        state.isLoadEdit = false;
        state.error = action.payload;
      })
      .addCase(deletePostThunk.pending, (state) => {
        state.isLoadDelete = true;
      })
      .addCase(deletePostThunk.fulfilled, (state) => {
        state.isLoadDelete = false;
      })
      .addCase(deletePostThunk.rejected, (state, action) => {
        state.isLoadDelete = false;
        state.error = action.payload;
      });
  },
});

export default postSlice.reducer;
