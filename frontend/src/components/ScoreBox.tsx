import React from "react";
import styled from "styled-components";

const ScoreBox = styled.div`
  background-color: #ffffff; // White background
  border-radius: 10px; // Rounded corners
  padding: 1.2rem;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // Subtle shadow for better visibility
  max-width: 300px; // Optional: limit the width
  margin: 0 auto; // Center the box horizontally
`;

const ScoreText = styled.p`
  font-size: 1.4rem;
  color: #000; // Black text color
`;

const ScoreNumber = styled.span`
  font-weight: bold; // Bold for the score number
`;

interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  return (
    <ScoreBox>
      <ScoreText>
        YOUR SCORE IS <ScoreNumber>{score}</ScoreNumber>
      </ScoreText>
    </ScoreBox>
  );
};

export default ScoreDisplay;
