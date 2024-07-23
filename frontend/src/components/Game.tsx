import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import io from "socket.io-client";
import api from "../services/api";

interface Question {
  image: string;
  answers: string[];
  correctAnswer: string;
}

const Game: React.FC = () => {
  const { user } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [time, setTime] = useState<number>(30);

  useEffect(() => {
    // Connect to WebSocket
    const socket = io("http://localhost:8000/ws/game");

    socket.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    socket.on("time", (data: number) => {
      setTime(data);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await api.get("/questions");
        setQuestion(response.data);
      } catch (error) {
        console.error("Failed to fetch question", error);
      }
    };

    fetchQuestion();
  }, []);

  const handleAnswer = async (answer: string) => {
    setSelectedAnswer(answer);
    if (answer === question?.correctAnswer) {
      // Move to next question or finish game
    } else {
      await api.post("/scores", {
        username: user.username,
        score: 0, // You should calculate the actual score
      });
      navigate("/ranking");
    }
  };

  return (
    <Container>
      {question && (
        <>
          <Image src={question.image} alt="question" />
          <Answers>
            {question.answers.map((answer, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(answer)}
                disabled={!!selectedAnswer}
              >
                {answer}
              </Button>
            ))}
          </Answers>
          <Timer>Time remaining: {time} seconds</Timer>
        </>
      )}
      {time === 0 && (
        <Modal>
          <ModalContent>
            <h2>Game Over</h2>
            <Button onClick={() => navigate("/ranking")}>Go to Ranking</Button>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Game;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
  margin-bottom: 1rem;
`;

const Answers = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  padding: 1rem;
  font-size: 1.2rem;
  cursor: pointer;
`;

const Timer = styled.div`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  text-align: center;
  border-radius: 8px;
`;
