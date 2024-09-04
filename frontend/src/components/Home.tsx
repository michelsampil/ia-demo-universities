import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { colors } from "../styles/colors";
import { BlendIconLight } from "./BlendIconLight";
import HowToPlayVideo from "../assets/videos/how-to-play.mp4";
import BlendBackground from "../assets/images/blend-background.svg";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/game");
  };

  return (
    <Container>
      <ColumnWrapper>
        <ColumnContainer>
          <Title>How to Play</Title>
          <VideoContainer>
            <Video src={HowToPlayVideo} loop autoPlay muted />
          </VideoContainer>
        </ColumnContainer>
        <ButtonContainer>
          <StartButton onClick={handleStart}>Start →</StartButton>
        </ButtonContainer>
      </ColumnWrapper>
      <Footer>
        <BlendIconLightStyled />
      </Footer>
    </Container>
  );
};

export default Home;

export const Container = styled.div`
  position: relative;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: ${colors.washedBlue};
  background-image: url(${BlendBackground});
  background-repeat: no-repeat;
  background-size: 100%; /* Scale down the SVG */
  background-position: center;
  flex-wrap: no-wrap;
`;

const ColumnWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled.h2`
  color: ${colors.white};
  font-size: 3rem;
  margin-top: 2rem;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`;

const VideoContainer = styled.div`
  width: 85%;
  border-radius: 16px;
  border: 7px solid ${colors.lightTurquoise};
  overflow: hidden; /* Ensures the video corners are rounded */
  margin: 2rem 0;
`;

const Video = styled.video`
  width: 100%;
  height: auto;
  border-radius: 0.5rem;
  filter: grayscale(100%);
`;

const ButtonContainer = styled.div`
  display: flex;
  align-content: center;
  align-items: center;
  padding-top: 10rem;
  padding-right: 4.5rem;
  justify-content: flex-end;
  width: 66.66%; /* Aligns with the video container's width */
`;

const StartButton = styled.button`
  height: 3.6rem;
  padding: 1rem 3rem;
  font-size: 1.5rem;
  cursor: pointer;
  background-color: ${colors.lightTurquoise};
  color: ${colors.blackGray};
  border: none;
  border-radius: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: ${colors.neonTurquoise};
  }
`;

const Footer = styled.footer`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100vw;
  height: 10vh;
  display: flex;
  justify-content: flex-end;
`;

const BlendIconLightStyled = styled(BlendIconLight)`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  width: 270px;
  height: 3rem;
`;
