import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Image, Button } from "react-bootstrap";
import { House, People, ChatDots, Gear } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import avatarImg from "../assets/01.avif";
import { useSelector } from "react-redux";

const SocialMediaNavbar = () => {
  const { profile: profileData } = useSelector((state) => state.profile);
  const { loggeout } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setProfile(profileData);
  }, [profileData]);

  useEffect(() => {
    loggeout && setProfile(null);
  }, [loggeout]);

  return (
    <Navbar
      bg="light"
      variant="light"
      expand="lg"
      sticky="top"
      className="shadow-sm"
    >
      <Container style={{ padding: "0" }}>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="w-100 justify-content-around align-items-center p-1">
            <Nav.Link as={Link} to="/friends">
              <People size={26} />
            </Nav.Link>
            <Nav.Link as={Link} to="/">
              <House size={26} />
            </Nav.Link>
            <Nav.Link as={Link} to="/messages">
              <ChatDots size={26} />
            </Nav.Link>
            <Nav.Link as={Link} to="/admin">
              Admin
            </Nav.Link>
            <div>
              {profile?.name || !profile?.name === undefined ? (
                <Link to="/user">
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
                    <Nav.Link as={Link} to="/login">
                      Login
                    </Nav.Link>
                  </Button>
                  <Button
                    variant="outline-primary"
                    style={{ margin: "0", fontSize: "15px" }}
                  >
                    <Nav.Link as={Link} to="/register">
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
