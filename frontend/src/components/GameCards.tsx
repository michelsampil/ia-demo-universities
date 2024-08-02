import styled, { keyframes } from "styled-components";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Styled component for the card container
const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px; // Adjust as needed
  margin: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

// Styled component for the glass effect card
const GlassCard = styled.div<{ rotation?: number }>`
  position: relative;
  font-size: 2rem;
  color: white;
  width: 15rem;
  height: 20rem;
  background: linear-gradient(#fff2, transparent);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 25px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.5s, margin 0.5s; // Ensure transition applies to transform and margin
  border-radius: 10px;
  backdrop-filter: blur(10px);
  transform: rotate(${(props) => props.rotation || 0}deg);
  margin: 0 -45px;

  &:hover {
    transform: rotate(0deg);
    margin: 0 10px;
  }

  &::before {
    content: attr(data-text);
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40px;
    background: rgba(255, 255, 255, 0.05);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
  }

  svg {
    font-size: 2.5em;
    fill: #fff;
  }
`;

// Button styled component
const Button = styled.button`
  background: #00eedd; // Change background color as needed
  border: none;
  color: white;
  padding: 10px 20px;
  margin: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background 0.3s ease;

  &:hover {
    background: #00d2d2; // Change hover color as needed
  }
`;

const CountdownOverlay = styled.div<{ show: boolean }>`
  display: ${(props) => (props.show ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 5rem;
  z-index: 1000;
  pointer-events: none; // Allow clicks to pass through the overlay
`;

const GameCategoryCards = () => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown === 0) {
      navigate("/game");
    } else if (countdown !== null) {
      const timer = setTimeout(
        () => setCountdown((prev) => (prev === null ? null : prev! - 1)),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [countdown, navigate]);

  const handlePlayClick = () => {
    setCountdown(3);
  };

  const handleRankingClick = () => {
    navigate("/ranking");
  };

  return (
    <>
      <CardContainer>
        <GlassCard data-text="Play 🎮" rotation={-15}>
          <ButtonContainer>
            <Button onClick={handlePlayClick}>Play 🎮</Button>
          </ButtonContainer>
        </GlassCard>
        <GlassCard data-text="Ranking 📊" rotation={5}>
          <ButtonContainer>
            <Button onClick={handleRankingClick}>Ranking 📊</Button>
          </ButtonContainer>
        </GlassCard>
      </CardContainer>
      <CountdownOverlay show={countdown !== null}>{countdown}</CountdownOverlay>
    </>
  );
};

export { GameCategoryCards };
