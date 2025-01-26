import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllUsers } from "../../services/allUsersServices";

export const getAllUsersThunk = createAsyncThunk(
  "allUsers/get",
  async (_, thunkAPI) => {
    try {
      const res = await getAllUsers();
      return res.data;
    } catch (error) {
      thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

const allUsersSlice = createSlice({
  name: "allUsers",
  initialState: {
    allUsers: [],
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsersThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allUsers = action.payload;
      })
      .addCase(getAllUsersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default allUsersSlice.reducer;
