import React from "react";
import { Outlet, Link } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="d-flex">
      <div
        className="text-center"
        style={{ width: "220px", borderRight: "1px solid" }}
      >
        <Link to="users">users</Link>
      </div>
      <Outlet />
    </div>
  );
};

export default AdminLayout;
