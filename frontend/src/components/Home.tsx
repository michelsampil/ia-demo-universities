// src/components/Home.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Button onClick={() => navigate("/game")}>Play</Button>
      <Button onClick={() => navigate("/ranking")}>Ranking</Button>
    </Container>
  );
};

export default Home;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 2rem;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  font-size: 1.5rem;
  cursor: pointer;
`;
