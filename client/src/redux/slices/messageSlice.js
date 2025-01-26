import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMessages, sentMessage } from "../../services/messageService";
import { refresh } from "../../services/authService";

export const getMessagesThunk = createAsyncThunk(
  "message/getMessages",
  async ({ accessToken, currentUserId }, thunkAPI) => {
    try {
      const res = await getMessages({ accessToken, currentUserId });
      return res.data;
    } catch (error) {
      if (error.response?.status === 403) {
        const { newAccessToken } = await refresh();
        if (newAccessToken) {
          const retryRes = await getMessages({
            accessToken: newAccessToken,
            currentUserId,
          });
          return retryRes.data;
        }
      }
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const sentMessageThunk = createAsyncThunk(
  "message/setMessage",
  async ({ accessToken, receiver, content }, thunkAPI) => {
    try {
      const res = await sentMessage({ accessToken, receiver, content });
      return res.data;
    } catch (error) {
      if (error.response?.status === 403) {
        const { newAccessToken } = await refresh();
        if (newAccessToken) {
          const retryRes = await sentMessage({
            accessToken: newAccessToken,
            receiver,
            content,
          });
          return retryRes.data;
        }
      }
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
    message: "",
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMessagesThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMessagesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
      })
      .addCase(getMessagesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(sentMessageThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sentMessageThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
      })
      .addCase(sentMessageThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default messageSlice.reducer;
