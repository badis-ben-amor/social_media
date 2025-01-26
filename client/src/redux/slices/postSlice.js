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
  async ({ content, accessToken }, thunkAPI) => {
    try {
      const res = await createPost({ content, accessToken });
      return res.data;
    } catch (error) {
      if (error.response?.status === 403) {
        const { newAccessToken } = await refresh();
        if (newAccessToken) {
          const createPostAgain = await createPost({
            content,
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
  async ({ content, accessToken }, thunkAPI) => {
    try {
      const res = await editPost({ content, accessToken });
      return res;
    } catch (error) {
      if (error.response?.status === 403) {
        const { newAccessToken } = await refresh();
        if (newAccessToken) {
          const editPostAgain = await editPost({
            content,
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
      return res;
    } catch (error) {
      if (error.response?.status === 403) {
        const { newAccessToken } = await refresh();
        if (newAccessToken) {
          const deletePostAgain = await editPost({
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
        state.isLoading = true;
      })
      .addCase(createPostThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createPostThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(editPostThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editPostThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(editPostThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deletePostThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePostThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deletePostThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default postSlice.reducer;
