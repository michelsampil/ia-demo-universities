import React from "react";
import styled from "styled-components";
import { colors } from "../styles/colors";
import goldMedal from "../assets/images/gold-medal.png";
import plateMedal from "../assets/images/plate-medal.png";
import bronceMedal from "../assets/images/bronce-medal.png";

interface Score {
  username: string;
  score: number;
  position: number;
}

interface PodiumProps {
  topThree: Score[];
}

const Podium: React.FC<PodiumProps> = ({ topThree }) => {
  // Sort topThree based on the desired order: 2, 1, 3
  const orderedTopThree = [topThree[1], topThree[0], topThree[2]];

  return (
    <PodiumContainer>
      {orderedTopThree.map((user, index) => (
        <PodiumPlace key={user.position} position={user.position}>
          <Medal>
            <img
              src={
                index === 0 ? plateMedal : index === 1 ? goldMedal : bronceMedal
              }
              alt={`medal-${
                index === 0 ? "gold" : index === 1 ? "plate" : "bronce"
              }`}
            />
          </Medal>
          <Username>{user.username}</Username>
          <Score>{user.score} pts</Score>
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
  background-color: ${colors.coolGray};
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const PodiumPlace = styled.div<{ position: number }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: ${(props) =>
    props.position === 1 ? "220px" : props.position === 2 ? "170px" : "120px"};
  background-color: ${(props) =>
    props.position === 1
      ? colors.tourqueeseStrong
      : props.position === 2
      ? colors.tourqueeseMid
      : colors.tourqueesePale};
  color: ${colors.blackGray};
  border-radius: ${(props) =>
    props.position === 1
      ? "30px 30px 0 0"
      : props.position === 2
      ? "30px 0 0 0"
      : "0 30px 0 0"};
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
