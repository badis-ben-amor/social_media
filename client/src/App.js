import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { useDispatch, useSelector } from "react-redux";
import { getProfileThunk } from "./redux/slices/profileSlice";
import Home from "./pages/Home";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminProtect from "./components/protects/AdminProtect";
import Profile from "./pages/Profile";
import UserProtectRoute from "./components/protects/UserProtectRoute";

const App = () => {
  const dispatch = useDispatch();
  // const { accessToken } = useSelector((state) => state.auth);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    dispatch(getProfileThunk(accessToken));
  }, [dispatch]);
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        {/* user routes */}
        <Route path="/user" element={<UserProtectRoute />}>
          <Route index element={<Profile />} />
        </Route>
        {/* admin routes */}
        <Route path="/admin" element={<AdminProtect />}>
          <Route path="users" element={<AdminUsersPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
