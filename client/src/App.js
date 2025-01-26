import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navebar from "./components/layouts/Navebar";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { useDispatch, useSelector } from "react-redux";
import { getProfileThunk } from "./redux/slices/profileSlice";
import Home from "./pages/Home";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminProtect from "./components/protects/AdminProtect";

const App = () => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getProfileThunk(accessToken));
  }, [dispatch]);
  return (
    <Router>
      <Navebar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        {/* admin */}
        <Route path="/admin" element={<AdminProtect />}>
          <Route path="users" element={<AdminUsersPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
