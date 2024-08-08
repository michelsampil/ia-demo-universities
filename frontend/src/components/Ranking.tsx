import React, { useState, useEffect } from "react";
import api from "../services/api";
import styled from "styled-components";

interface Score {
  username: string;
  score: number;
  date: string;
  position: number;
}

const Ranking: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await api.get("/scores/scores/top/10");
        const userScores: Score[] = response.data.map((e: any) => ({
          username: e.user_email,
          score: e.value,
          date: e.date,
          position: e.position,
        }));
        setScores(userScores);
      } catch (error) {
        console.error("Failed to fetch scores", error);
      }
    };

    fetchScores();

    // WebSocket connection for ranking updates
    const socket = new WebSocket("ws://localhost:8000/ws"); // replace with your WebSocket server URL

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Message received:", data);
      if (data.event === "ranking_update") {
        const updatedScores: Score[] = data.ranking.map((e: any) => ({
          username: e.user_email,
          score: e.score,
          date: e.date,
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

  return (
    <Container>
      <Title>🏆 Ranking 🏆</Title>
      <Table>
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
            let medalEmoji = "";
            if (score.position === 1) medalEmoji = "🥇";
            else if (score.position === 2) medalEmoji = "🥈";
            else if (score.position === 3) medalEmoji = "🥉";

            return (
              <tr key={score.position}>
                <td>
                  {score.position} {medalEmoji}
                </td>
                <td>{score.username}</td>
                <td style={{ color: colors.lightTurquoise }}>{score.score}</td>
                <td>{new Date(score.date).toLocaleDateString()}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default Ranking;

const colors = {
  coolGray: "#314550",
  gray: "#1A1A1A",
  darkGray: "#0B0D0E",
  white: "#FFFFFF",
  offWhite: "#F4F3F0",
  lightTurquoise: "#00EDED",
  neonTurquoise: "#A2F3F3",
  washedBlue: "#053057",
  blackGray: "#252525",
  neonRed: "#FF073A",
  neonPink: "#FF66B2",
  neonGreen: "#39FF14",
  neonYellow: "#FFFF33",
};

const Container = styled.div`
  height: 100vh;
  padding: 2rem;
  background-color: ${colors.blackGray};
  color: ${colors.white};
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: ${colors.neonTurquoise};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    border: 1px solid ${colors.gray};
    padding: 8px;
    text-align: center;
  }

  th {
    background-color: ${colors.coolGray};
    color: ${colors.white};
  }

  tr:nth-child(odd) {
    background-color: ${colors.darkGray};
  }

  tr:nth-child(even) {
    background-color: ${colors.blackGray};
  }
`;
