// src/components/Navbar.tsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styled from "styled-components";

const Navbar: React.FC = () => {
  const { user, logout } = useContext(AuthContext)!;

  return (
    <Nav>
      <NavLink to="/">Home</NavLink>
      {user && (
        <>
          <NavLink to="/ranking">Ranking</NavLink>
          <NavButton onClick={logout}>Logout</NavButton>
        </>
      )}
    </Nav>
  );
};

export default Navbar;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background-color: #282c34;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  margin: 0 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
