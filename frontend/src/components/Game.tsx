import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import io from "socket.io-client";
import api from "../services/api";

interface Question {
  id: number;
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
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      ws.send(
        JSON.stringify({ event: "start_game", message: "Hello from React!" })
      );
    };

    ws.onmessage = (event) => {
      console.log("Message from server:", event.data);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // return () => {
    //   ws.close();
    // };
  }, []);

  const handleAnswer = async (answer: string) => {
    setSelectedAnswer(answer);
    socket.emit("submit_answer", {
      username: user.username,
      question_id: question?.id,
      answer: answer,
    });
  };

  const handleTimeUp = async () => {
    socket.emit("submit_answer", {
      username: user.username,
      question_id: question?.id,
      answer: selectedAnswer,
    });
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
