import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../../redux/slices/authSlice";
import { Button, Card, Container, Form } from "react-bootstrap";
import { Lock } from "react-bootstrap-icons";

const Login = () => {
  const dispatch = useDispatch();

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginThunk(userData));
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="" style={{ width: "400px", backgroundColor: "#f4f4f4" }}>
        <Card.Body>
          <div className="d-flex justify-content-center mb-2">
            <div
              className="d-flex justify-content-center align-items-center rounded-circle"
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: "#ede1be",
              }}
            >
              <Lock size={24} />
            </div>
          </div>
          <h5 className="text-center text-color-primary">Sign In</h5>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                name="email"
                value={FormData.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                placeholder="Password"
              />
            </Form.Group>
            <Button
              type="submit"
              style={{ backgroundColor: "#dec06f", color: "black" }}
              className="w-100"
            >
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
