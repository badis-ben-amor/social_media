import React from "react";
import { useSelector } from "react-redux";
import AdminLayout from "../admin/AdminLayout";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { loginThunk } from "../../redux/slices/authSlice";
import { getProfileThunk } from "../../redux/slices/profileSlice";

const AdminProtect = () => {
  const dispatch = useDispatch();
  const { profile, isLoading } = useSelector((state) => state.profile);
  const { accessToken } = useSelector((state) => state.auth);

  return profile.isAdmin ? (
    <AdminLayout />
  ) : profile.isAdmin === undefined && isLoading ? (
    ""
  ) : (
    <>
      <div className="w-100 m-5 text-center">
        <h2>You are not admin</h2>
        <br />
        <Button
          onClick={() => {
            dispatch(
              loginThunk({ email: "admin@gmail.com", password: "admin" })
            ).then(() => dispatch(getProfileThunk(accessToken)));
          }}
        >
          Login as admin
        </Button>
      </div>
    </>
  );
};

export default AdminProtect;
