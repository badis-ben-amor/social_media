import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsersAdminThunk,
  createUserAdminThunk,
  updateUserAdminThunk,
  deleteUserAdminThunk,
} from "../../redux/slices/admin/userSliceAdmin";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import Swal from "sweetalert2";

const AdminUsersPage = () => {
  const dispatch = useDispatch();
  const { users: usersData } = useSelector((state) => state.adminUser);
  const { accessToken } = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const [currenTab, setCurrenTab] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
  });

  useEffect(() => {
    dispatch(getAllUsersAdminThunk(accessToken));
  }, [dispatch]);

  useEffect(() => {
    setUsers(usersData);
  }, [usersData]);

  const handleTabChange = (event, newValue, index) => {
    newValue === 2
      ? setFormData({ name: "", email: "", password: "", isAdmin: false })
      : setFormData(users[selectedUserIndex]);
    setCurrenTab(newValue);
  };

  const handleUserSelection = (index) => {
    setSelectedUserIndex(index);
    currenTab !== 2 && setFormData(users[index]);
    // setCurrenTab(0);
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateUser = async () => {
    dispatch(
      createUserAdminThunk({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        isAdmin: formData.isAdmin,
        accessToken,
      })
    )
      .unwrap()
      .then(() => {
        setFormData({ name: "", email: "", password: "", isAdmin: false });
        dispatch(getAllUsersAdminThunk(accessToken));
      })
      .catch((error) => {
        Swal.fire({
          title: error,
          text: "",
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            title: "custom-title",
            text: "custom-text",
          },
        });
      });
  };

  const handleUpdateUser = (userId) => {
    dispatch(
      updateUserAdminThunk({
        accessToken,
        userId,
        name: formData.name,
        email: formData.email,
        isAdmin: formData.isAdmin,
      })
    ).then(() => {
      setFormData({ name: "", email: "", isAdmin: false });
      dispatch(getAllUsersAdminThunk(accessToken));
    });
  };

  const handleDeleteUser = (userId) => {
    dispatch(deleteUserAdminThunk({ accessToken, userId })).then(() => {
      setFormData({ name: "", email: "", isAdmin: false });
      dispatch(getAllUsersAdminThunk(accessToken));
    });
  };

  const renderTableContent = () => {
    const user = users[selectedUserIndex];
    switch (currenTab) {
      case 0:
        return (
          <Typography>
            <strong>Profile:</strong>
            <br />
            Name:{user?.name}
            <br />
            Email:{user?.email}
            <br />
            Role:{user?.isAdmin ? "Administrator" : "User"}
          </Typography>
        );
      case 1:
        return (
          <Box>
            {/* <Typography>Edit User</Typography> */}
            <TextField
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <FormControlLabel
              sx={{ display: "block", marginY: 2 }}
              control={
                <Checkbox
                  checked={formData.isAdmin ?? user.isAdmin}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isAdmin: e.target.checked,
                    }))
                  }
                />
              }
              label="Admin"
            />
            <Button
              variant="contained"
              onClick={() => handleUpdateUser(user._id)}
              sx={{ marginRight: 2, borderRadius: 2 }}
            >
              Update
            </Button>
            <Button
              variant="contained"
              onClick={() => handleDeleteUser(user._id)}
              sx={{ marginRight: 2, backgroundColor: "brown", borderRadius: 2 }}
            >
              Delete
            </Button>
          </Box>
        );
      case 2:
        return (
          <Box>
            <TextField
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <FormControlLabel
              sx={{ display: "block", marginY: 2 }}
              control={
                <Checkbox
                  checked={formData.isAdmin}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isAdmin: e.target.checked,
                    }))
                  }
                />
              }
              label="Admin"
            />
            <Button
              variant="contained"
              onClick={() => handleCreateUser()}
              sx={{ marginRight: 2, borderRadius: 2 }}
            >
              Create
            </Button>
          </Box>
        );
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 800,
        width: 600,
        height: 500,
        margin: "auto",
        marginTop: 5,
        backgroundColor: "#fafbfc",
      }}
    >
      <Box sx={{ display: "flex" }}>
        <Box sx={{ width: "22%", height: 500, backgroundColor: "#e8e9eb" }}>
          <List>
            {users.map((user, index) => (
              <ListItem
                button
                key={index}
                selected={selectedUserIndex === index}
                onClick={() => {
                  handleUserSelection(index);
                }}
                sx={{
                  cursor: "pointer",
                  backgroundColor: selectedUserIndex === index ? "#c1c4c9" : "",
                }}
              >
                <ListItemText primary={user.name} />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box sx={{ width: "78%" }}>
          <Tabs
            value={currenTab}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Profile" />
            <Tab label="Edit" />
            <Tab label="Create" />
          </Tabs>
          <CardContent>
            <Box sx={{ padding: 2 }}>{renderTableContent()}</Box>
          </CardContent>
        </Box>
      </Box>
    </Card>
  );
};

export default AdminUsersPage;
