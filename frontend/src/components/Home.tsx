import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { GameCategoryCards } from "./GameCards";
import { colors } from "../styles/colors";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <ColumnContainer>
        <Title>Choose between the categories: </Title>
        <Container>
          <GameCategoryCards />
        </Container>
      </ColumnContainer>
    </PageWrapper>
  );
};

export default Home;

const Title = styled.h2`
  color: white;
  font-size: 3rem;
  margin: 2rem;
`;

const PageWrapper = styled.div`
  background-color: ${colors.blackGray};
`;

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100vh;
  gap: 5rem;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
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
