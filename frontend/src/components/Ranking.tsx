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

  return (
    <Container>
      <Title>Ranking</Title>
      <Table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Score</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <tr key={index}>
              <td>{score.username}</td>
              <td>{score.score}</td>
              <td>{new Date(score.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Ranking;

const Container = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }

  th {
    background-color: #f4f4f4;
  }
`;
