import React from "react";
import { BoxArrowRight } from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import { logoutThunk } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutThunk())
      .unwrap()
      .then(() => navigate("/"))
      .catch((err) => alert("Logout error : " + (err.message || err)));
  };
  return (
    <div className="d-flex justify-content-center mt-4">
      <h3 onClick={handleLogout}>
        <BoxArrowRight style={{ cursor: "pointer" }} />
      </h3>
    </div>
  );
};

export default Profile;
