import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsersThunk } from "../../redux/slices/allUsersSlice";
import { Card, Container, ListGroup } from "react-bootstrap";
import img01 from "../../assets/01.avif";

const UsersList = ({ onUserClick }) => {
  const dispatch = useDispatch();
  const { allUsers: allUsersData } = useSelector((state) => state.allUsers);

  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    dispatch(getAllUsersThunk());
  }, [dispatch]);

  useEffect(() => {
    setAllUsers(allUsersData);
  }, [allUsersData]);

  return (
    <Container
      style={{
        position: "sticky",
        top: "69px",
        height: "80vh",
        overflow: "auto",
        cursor: "pointer",
      }}
    >
      {allUsers?.map((user, i) => (
        <>
          {" "}
          <Card
            key={i}
            onClick={() => onUserClick(user)}
            // className="mb-3"
            style={{ backgroundColor: "#f8f7fa" }}
          >
            <Card.Header className="d-flex align-items-center">
              <img
                src={img01}
                alt="User Avatar"
                className="rounded-circle me-2"
                style={{ width: "35px", height: "35px" }}
              />
              <h6 className="mb-0">{user.name}</h6>
            </Card.Header>
          </Card>
          <br></br>
        </>
      ))}
    </Container>
  );
};

export default UsersList;
