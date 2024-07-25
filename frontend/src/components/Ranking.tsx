import React, { useState, useEffect } from "react";
import api from "../services/api";
import styled from "styled-components";

interface Score {
  username: string;
  score: number;
  date: string;
}

const Ranking: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await api.get("/ranking");
        setScores(response.data);
      } catch (error) {
        console.error("Failed to fetch scores", error);
      }
    };

    fetchScores();
  }, []);

  // Add sample data if no scores are available
  if (scores.length === 0) {
    const scores = [
      { username: "Michel Sampil", score: 1200, date: "2024-07-25T12:00:00Z" },
      { username: "Alice", score: 1150, date: "2024-07-24T12:00:00Z" },
      { username: "Bob", score: 1100, date: "2024-07-23T12:00:00Z" },
      { username: "Charlie", score: 1050, date: "2024-07-22T12:00:00Z" },
      { username: "David", score: 1000, date: "2024-07-21T12:00:00Z" },
    ];

    setScores(scores);
  }

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
          {scores.map((score, index) => {
            let medalEmoji = "";
            if (index === 0) medalEmoji = "🥇";
            else if (index === 1) medalEmoji = "🥈";
            else if (index === 2) medalEmoji = "🥉";

            return (
              <tr key={index}>
                <td>
                  {index + 1} {medalEmoji}
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
