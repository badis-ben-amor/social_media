import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerThunk } from "../../redux/slices/authSlice";
import { Button, Card, Container, Form } from "react-bootstrap";
import { Lock } from "react-bootstrap-icons";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleFieldChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerThunk(userData));
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center vh-100"
    >
      <Card className="p-4" style={{ width: "400px", background: "#f4f4f4" }}>
        <Card.Body>
          <div className="d-flex justify-content-center mb-3">
            <div
              className=" d-flex justify-content-center align-items-center rounded-circle "
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: "#ede1be",
              }}
            >
              <Lock size={24}></Lock>
            </div>
          </div>
          <h5 className="text-center mb-4">Sign Up</h5>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                name="name"
                value={userData.name}
                onChange={handleFieldChange}
                placeholder="Username"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                name="email"
                value={userData.email}
                onChange={handleFieldChange}
                placeholder="Email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                name="password"
                value={userData.password}
                onChange={handleFieldChange}
                placeholder="Password"
              />
            </Form.Group>
            <Button
              style={{ backgroundColor: "#dec06f", color: "black" }}
              type="submit"
              className="w-100"
            >
              Create Account
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RegisterPage;
