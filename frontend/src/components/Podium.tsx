import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Confetti from "react-confetti";
import { colors } from "../styles/colors";
import goldMedal from "../assets/images/gold-medal.png";
import plateMedal from "../assets/images/plate-medal.png";
import bronceMedal from "../assets/images/bronce-medal.png";

interface Score {
  username: string;
  score: number;
  position?: number; // Made position optional to handle undefined cases
}

interface PodiumProps {
  topThree: Score[];
}

const Podium: React.FC<PodiumProps> = ({ topThree }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const previousTopThreeRef = useRef<Score[]>([]);

  // Sort topThree based on the desired order: 2, 1, 3
  const orderedTopThree = [topThree[1], topThree[0], topThree[2]];

  useEffect(() => {
    // Check if the scores have changed compared to the previous render
    const hasScoreChanged = topThree.some((user, index) => {
      const previousUser = previousTopThreeRef.current[index];
      return previousUser && user.score !== previousUser.score;
    });

    if (hasScoreChanged) {
      setShowConfetti(true);

      // Stop confetti after a short duration
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000); // Adjust the duration as needed

      // Cleanup timer on component unmount or when topThree changes
      return () => clearTimeout(timer);
    }

    // Update the ref with the current topThree for the next render
    previousTopThreeRef.current = topThree;
  }, [topThree]);

  return (
    <PodiumContainer>
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      {orderedTopThree.length > 0 &&
        orderedTopThree.map((user, index) => (
          <PodiumPlace key={index} position={user?.position}>
            <Medal>
              <img
                src={
                  index === 0
                    ? plateMedal
                    : index === 1
                    ? goldMedal
                    : bronceMedal
                }
                alt={`medal-${
                  index === 0 ? "plate" : index === 1 ? "gold" : "bronce"
                }`}
              />
            </Medal>
            {user?.username && <Username>{user?.username}</Username>}
            <Score>{user?.score} pts</Score>
          </PodiumPlace>
        ))}
    </PodiumContainer>
  );
};

export default Podium;

const PodiumContainer = styled.div`
  display: flex;
  align-items: flex-end;
  padding: 2rem;
  background-color: ${colors.washedBlue};
  border-radius: 8px;
  position: relative; /* Ensure confetti is visible within the container */
`;

const PodiumPlace = styled.div<{ position?: number }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: ${(props) => {
    if (props.position === 1) return "220px";
    if (props.position === 2) return "170px";
    if (props.position === 3) return "120px";
    return "150px"; // Default height for undefined positions
  }};
  background-color: ${(props) => {
    if (props.position === 1) return colors.tourqueeseStrong;
    if (props.position === 2) return colors.tourqueeseMid;
    if (props.position === 3) return colors.tourqueesePale;
    return colors.gray; // Default color for undefined positions
  }};
  color: ${colors.blackGray};
  border-radius: ${(props) => {
    if (props.position === 1) return "30px 30px 0 0";
    if (props.position === 2) return "30px 0 0 0";
    if (props.position === 3) return "0 30px 0 0";
    return "10px"; // Default border-radius for undefined positions
  }};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  transition: height 0.5s ease-in-out;
  flex-basis: 300px;
`;

const Medal = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;

  img {
    width: 50px;
    height: 60px;
  }
`;

const Username = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
`;

const Score = styled.div`
  font-size: 1rem;
  color: ${colors.darkGray};
`;
