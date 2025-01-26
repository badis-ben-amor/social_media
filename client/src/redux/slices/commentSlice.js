import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "../../services/commentService";
import { refresh } from "../../services/authService";

export const getCommentsThunk = createAsyncThunk(
  "/comment/getComments",
  async (_, thunkAPI) => {
    try {
      const res = await getComments();
      return res.data;
    } catch (error) {
      thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createCommentThunk = createAsyncThunk(
  "comment/createComment",
  async ({ postId, content, accessToken }, thunkAPI) => {
    try {
      const res = await createComment(postId, content, accessToken);
      return res.data;
    } catch (error) {
      if (error.response?.status === 403) {
        const { newAccessToken } = await refresh();
        if (newAccessToken) {
          const createCommentAgain = await createComment(
            postId,
            content,
            newAccessToken
          );
          return createCommentAgain.data;
        }
      }
      thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateCommentThunk = createAsyncThunk(
  "comment/updateComment",
  async ({ postId, content, commentId, accessToken }, thunkAPI) => {
    try {
      const res = await updateComment({
        postId,
        content,
        commentId,
        accessToken,
      });
      return res.data;
    } catch (error) {
      if (error.response?.status === 403) {
        const { newAccessToken } = await refresh();
        if (newAccessToken) {
          const updateCommentAgain = await updateComment({
            postId,
            content,
            commentId,
            accessToken: newAccessToken,
          });
          return updateCommentAgain.data;
        }
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
    }
  }
);

export const deleteCommentThunk = createAsyncThunk(
  "comment/deleteComment",
  async ({ postId, commentId, accessToken }, thunkAPI) => {
    try {
      const res = await deleteComment({ postId, commentId, accessToken });
      return res.data;
    } catch (error) {
      if (error.response?.status === 403) {
        const { newAccessToken } = await refresh();
        if (newAccessToken) {
          const deleteCommentAgain = await deleteComment({
            postId,
            commentId,
            accessToken: newAccessToken,
          });
          return deleteCommentAgain.data;
        }
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
    }
  }
);

const commentsSlice = createSlice({
  name: "comment",
  initialState: {
    comments: [],
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCommentsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCommentsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = action.payload;
      })
      .addCase(getCommentsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createCommentThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCommentThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createCommentThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateCommentThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCommentThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateCommentThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteCommentThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCommentThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteCommentThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default commentsSlice.reducer;
