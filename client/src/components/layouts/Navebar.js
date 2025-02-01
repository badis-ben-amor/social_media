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
            <Nav.Link as={NavLink} to="/friends">
              <People size={26} className="me-1" />
            </Nav.Link>
            <Nav.Link as={NavLink} to="/">
              <House size={26} className="me-1" />
            </Nav.Link>
            <Nav.Link as={NavLink} to="/messages">
              <ChatDots size={26} className="me-1" />
            </Nav.Link>
            <Nav.Link as={NavLink} to="/admin">
              {/* <Gear size={26} className="me-1" /> */}
              Admin
            </Nav.Link>
            <div>
              {profile.name || !profile.name === undefined ? (
                <Link to="/profile">
                  <Image
                    src={avatarImg}
                    roundedCircle
                    alt="Avatar"
                    width={29}
                    height={29}
                    className="ms-2"
                  />
                </Link>
              ) : (
                <>
                  <Button
                    style={{ margin: "0", fontSize: "15px" }}
                    className="me-2"
                    variant="outline-primary"
                  >
                    <Nav.Link as={NavLink} to="/login">
                      Login
                    </Nav.Link>
                  </Button>
                  <Button
                    variant="outline-primary"
                    style={{ margin: "0", fontSize: "15px" }}
                  >
                    <Nav.Link as={NavLink} to="/register">
                      Register
                    </Nav.Link>
                  </Button>
                </>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default SocialMediaNavbar;
