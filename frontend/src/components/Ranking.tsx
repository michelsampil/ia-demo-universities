import React, { useState, useEffect } from "react";
import api from "../services/api";
import styled from "styled-components";
import { Container } from "./Home";
import { colors } from "../styles/colors";
import Confetti from "react-confetti";

import goldMedal from "../assets/images/gold-medal.png";
import silverMedal from "../assets/images/plate-medal.png";
import bronzeMedal from "../assets/images/bronce-medal.png";

interface Score {
  username: string;
  score: number;
  timestamp: string;
  position: number;
}

const Ranking: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [confettiAmount, setConfettiAmount] = useState(1200);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await api.get("/scores/scores/top/10");
        const userScores: Score[] = response.data.map((e: any) => ({
          username: e.user_email,
          score: e.value,
          timestamp: e.timestamp,
          position: e.position,
        }));
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
        const updatedScores: Score[] = data.ranking.map((e: any) => ({
          username: e.user_email,
          score: e.score,
          timestamp: e.timestamp,
          position: e.position,
        }));
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

  console.log("confeti", confettiAmount);

  return (
    <Container>
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={confettiAmount}
        recycle={false}
        tweenDuration={30000}
      />

      <RankingContainer>
        <Title>Ranking</Title>
        <StyledTable>
          <thead>
            <tr>
              <th>Position</th>
              <th>User</th>
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
                <tr key={score.position}>
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
                  <td>{score.username}</td>
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
    </Container>
  );
};

export default Ranking;

const PositionCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

const RankingContainer = styled.div`
  height: 100vh;
  padding: 2rem;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: ${colors.tourqueeseBright};
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

  tr:hover {
    background-color: ${colors.tourqueeseBright};
    border: 2px solid ${colors.lightTurquoise};
    box-shadow: 0 0 8px ${colors.lightTurquoise};
  }
`;

const ScoreValue = styled.td`
  color: ${colors.lightTurquoise};
  font-weight: bold;
`;
