import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProfile } from "../../services/profileService";
import { refresh } from "../../services/authService";

export const getProfileThunk = createAsyncThunk(
  "profile/getProfile",
  async (accessToken, thunkAPI) => {
    try {
      const res = await getProfile(accessToken);
      return res.data;
    } catch (error) {
      if (error.response?.status === 401) {
        const { newAccessToken } = await refresh();
        if (newAccessToken) {
          const newGetProfile = await getProfile(newAccessToken);
          return newGetProfile.data;
        }
      }
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: {},
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfileThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(getProfileThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;
