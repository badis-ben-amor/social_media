import React from "react";
import { Navbar, Nav, Container, Image, Button } from "react-bootstrap";
import { House, People, ChatDots, Gear } from "react-bootstrap-icons";
import { Link, NavLink } from "react-router-dom"; // For SPA routing
import avatarImg from "../../assets/01.avif"; // Replace with your avatar image path
import { useSelector } from "react-redux";

const SocialMediaNavbar = () => {
  const { profile, isLoading } = useSelector((state) => state.profile);
  const { isLoading: au } = useSelector((state) => state.auth);

  return (
    <Navbar
      bg="light"
      variant="light"
      expand="lg"
      sticky="top"
      className="shadow-sm"
    >
      <Container style={{ padding: "0" }}>
        {/* Navbar Links */}
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="w-100 d-flex justify-content-around align-items-center p-1">
            <Nav.Link as={NavLink} to="/friends" exact>
              <People size={26} className="me-1" />
            </Nav.Link>
            <Nav.Link as={NavLink} to="/">
              <House size={26} className="me-1" />
            </Nav.Link>
            <Nav.Link as={NavLink} to="/messages">
              <ChatDots size={26} className="me-1" />
            </Nav.Link>
            <Nav.Link as={NavLink} to="/admin">
              <Gear size={26} className="me-1" />
              admin
            </Nav.Link>
            <Nav.Link as={NavLink} to="/profile">
              {profile.name || !profile.name === undefined ? (
                <Image
                  src={avatarImg}
                  roundedCircle
                  alt="Avatar"
                  width={29}
                  height={29}
                  className="ms-2"
                />
              ) : (
                <>
                  <Link to="/login">
                    <Button
                      style={{ margin: "0", fontSize: "15px" }}
                      className="me-2"
                      variant="outline-primary"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button
                      variant="outline-primary"
                      style={{ margin: "0", fontSize: "15px" }}
                    >
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default SocialMediaNavbar;
