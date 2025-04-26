import React from "react";
import { Power } from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

const UserProtectRoute = () => {
  const navigate = useNavigate();

  const { profile } = useSelector((state) => state.profile);
  return profile._id ? (
    <Outlet />
  ) : (
    <div className="d-block text-center mt-4">
      <h4 className="my-4"> Not Allowed User Only</h4>
      <h3 onClick={() => navigate("/login")}>
        <Power style={{ cursor: "pointer" }} />
      </h3>
    </div>
  );
};

export default UserProtectRoute;
