import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addLike, deleteLike } from "../../services/likeService";
import { refresh } from "../../services/authService";

export const addLikeThunk = createAsyncThunk(
  "like/addLike",
  async ({ accessToken, postId }, thunkAPI) => {
    try {
      const res = await addLike(accessToken, postId);
      return res.data;
    } catch (error) {
      if (error.response?.status === 403) {
        const { newAccessToken } = await refresh();
        if (newAccessToken) {
          const restryAddLike = await addLike(newAccessToken, postId);
          return restryAddLike.data;
        }
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
    }
  }
);

export const deleteLikeThunk = createAsyncThunk(
  "like/deleteLike",
  async ({ postId, likeId, accessToken }, thunkAPI) => {
    try {
      const res = await deleteLike(postId, likeId, accessToken);
      return res.data;
    } catch (error) {
      if (error.response?.status === 403) {
        const { newAccessToken } = await refresh();
        if (newAccessToken) {
          const deleteLikeAgain = await deleteLike(
            postId,
            likeId,
            newAccessToken
          );
          return deleteLikeAgain.data;
        }
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
    }
  }
);

const addLikeSlice = createSlice({
  name: "like",
  initialState: {
    like: {},
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(addLikeThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addLikeThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.like=
      })
      .addCase(addLikeThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteLikeThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteLikeThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteLikeThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default addLikeSlice.reducer;
