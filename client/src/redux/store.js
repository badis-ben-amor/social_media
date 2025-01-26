import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";
import postReducer from "./slices/postSlice";
import commentReducer from "./slices/commentSlice";
import likeReducer from "./slices/likeSlice";
import messageReducer from "./slices/messageSlice";
import allUsersReducer from "./slices/allUsersSlice";
import adminUserReducer from "./slices/admin/userSliceAdmin";

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    post: postReducer,
    comment: commentReducer,
    like: likeReducer,
    message: messageReducer,
    allUsers: allUsersReducer,
    adminUser: adminUserReducer,
  },
});

export default store;
