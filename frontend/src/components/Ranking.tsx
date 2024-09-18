import React, { useState, useEffect } from "react";
import api from "../services/api";
import styled from "styled-components";
import { Container } from "./Home";
import { colors } from "../styles/colors";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";

import goldMedal from "../assets/images/gold-medal.png";
import silverMedal from "../assets/images/plate-medal.png";
import bronzeMedal from "../assets/images/bronce-medal.png";

interface Score {
  name: string;
  email: string;
  score: number;
  timestamp: string;
  position: number;
}

const Ranking: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [confettiAmount, setConfettiAmount] = useState(1200);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await api.get("/scores/scores/top/10");
        const userScores: Score[] = filterScores(
          response.data.map((e: any) => ({
            name: e.name,
            email: e.email,
            score: e.value,
            timestamp: e.timestamp,
            position: e.position,
          }))
        );
        setScores(userScores);
      } catch (error) {
        console.error("Failed to fetch scores", error);
      }
    };

    fetchScores();

    const socket = new WebSocket("ws://localhost:8000/ws");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event === "ranking_update") {
        const updatedScores: Score[] = filterScores(
          data.ranking.map((e: any) => ({
            name: e.name,
            email: e.email,
            score: e.score,
            timestamp: e.timestamp,
            position: e.position,
          }))
        );
        setScores(updatedScores);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signup");
  };

  const filterScores = (scores: Score[]): Score[] => {
    const uniqueScores = scores
      .filter((score) => score.name !== "Unknown") // Remove "Unknown" users
      .reduce((acc: Record<string, Score>, current) => {
        const existing = acc[current.email];
        // Keep only the highest score for each user
        if (!existing || current.score > existing.score) {
          acc[current.email] = current;
        }
        return acc;
      }, {});

    // Convert object back to an array and sort by score
    const sortedScores = Object.values(uniqueScores).sort(
      (a, b) => b.score - a.score
    );

    // Reassign positions sequentially starting from 1
    return sortedScores.map((score, index) => ({
      ...score,
      position: index + 1,
    }));
  };
  return (
    <Container>
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={confettiAmount}
        recycle={false}
        tweenDuration={30000}
      />

      <Header>
        <Title>Ranking</Title>
      </Header>

      <RankingContainer>
        <StyledTable>
          <thead>
            <tr>
              <th>Position</th>
              <th>Name</th>
              <th>Email</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score) => {
              let medalImage = "";
              if (score.position === 1) medalImage = goldMedal;
              else if (score.position === 2) medalImage = silverMedal;
              else if (score.position === 3) medalImage = bronzeMedal;

              return (
                <tr key={score.email}>
                  <td>
                    <PositionCell>
                      {score.position}{" "}
                      {medalImage && (
                        <img
                          src={medalImage}
                          alt="medal"
                          style={{ width: "24px", height: "24px" }}
                        />
                      )}
                    </PositionCell>
                  </td>
                  <td>{score.name}</td>
                  <td>{score.email}</td>
                  <ScoreValue>{score.score}</ScoreValue>
                  <td>
                    {new Date(score.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </StyledTable>
      </RankingContainer>

      <LogoutButton onClick={handleLogout}>Logout ←</LogoutButton>
    </Container>
  );
};

export default Ranking;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 2rem;
`;

const Title = styled.h1`
  text-align: center;
  color: ${colors.tourqueeseBright};
`;

const PositionCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

const RankingContainer = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  th,
  td {
    padding: 12px;
    text-align: center;
    color: ${colors.washedBlue};
  }

  th {
    background-color: ${colors.tourqueeseMid};
    color: ${colors.washedBlue};
  }

  tr:nth-child(odd) {
    background-color: ${colors.lightTurquoise};
  }

  tr:nth-child(even) {
    background-color: ${colors.tourqueeseMid};
  }

  tr {
    transition: background-color 0.3s ease, box-shadow 0.3s ease,
      transform 0.3s ease;
  }

  tr:hover {
    background-color: ${colors.neonTurquoise}; /* Bright turquoise for hover effect */
    box-shadow: 0 0 12px ${colors.neonTurquoise},
      0 0 20px rgba(0, 255, 255, 0.4); /* Added glow effect */
    transform: scale(1.02); /* Slightly scale up for emphasis */
  }
`;

const ScoreValue = styled.td`
  color: ${colors.lightTurquoise};
  font-weight: bold;
`;

const LogoutButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 0.5rem 1rem;
  background-color: ${colors.lightTurquoise};
  color: ${colors.washedBlue};
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  font-weight: bold;

  &:hover {
    background-color: ${colors.tourqueeseBright};
  }
`;
