// src/components/Game.js
import React, { useState, useEffect, useContext, useMemo } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { colors } from "../styles/colors";
import { StyledCard } from "./Card";

interface Question {
  id: number;
  image: string;
  options: string[];
  correctAnswer: string;
  category: string;
}

const Game: React.FC = () => {
  const { user } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [time, setTime] = useState<number>(30);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");
    setSocket(ws);

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      ws.send(
        JSON.stringify({ event: "start_game", message: "Hello from React!" })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Message from server:", data);

      if (data.event === "question") {
        setQuestion(data.question);
      } else if (data.event === "time") {
        setTime(data.time);
      } else if (data.event === "time_up") {
        handleTimeUp();
      } else if (data.event === "answer_result") {
        // Handle answer result if needed
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleAnswer = async (answer: string) => {
    setSelectedAnswer(answer);
    socket?.send(
      JSON.stringify({
        event: "submit_answer",
        username: user.username,
        question_id: question?.id,
        answer: answer,
      })
    );
  };

  const handleTimeUp = async () => {
    setTime(0);

    socket?.send(
      JSON.stringify({
        event: "submit_answer",
        username: user.username,
        question_id: question?.id,
        answer: selectedAnswer,
      })
    );
  };

  const getTimeColor = useMemo(() => {
    if (time > 20) {
      return colors.lightTurquoise;
    } else if (time > 10) {
      return colors.neonYellow;
    } else if (time > 1) {
      return colors.neonRed;
    } else return colors.darkGray;
  }, [time]);

  return (
    <Container>
      {question && (
        <>
          <LeftPanel>
            <QuestionCard>
              <Image
                src={`http://localhost:8000/assets/images/${question.image}.png`}
                alt="question"
              />
            </QuestionCard>
          </LeftPanel>
          <RightPanel>
            <UserCard>
              <Avatar
                src="https://avatars.githubusercontent.com/u/13066412?v=4"
                alt="User Avatar"
              />
              <Info>
                <h2>{user.username}</h2>
                <ScoreText>Score: 100</ScoreText>
                <TimeDisplay color={getTimeColor}>⏰ Time: {time}s</TimeDisplay>
                <Category>Category: {question.category}</Category>
              </Info>
            </UserCard>
            <UserCard>
              <OptionPanel>
                <OptionPanelTitle>
                  🤔 What's the image meaning?
                </OptionPanelTitle>
                <Answers>
                  {question?.options?.map((answer, index) => (
                    <AnswerButton
                      key={index}
                      onClick={() => handleAnswer(answer)}
                      disabled={!!selectedAnswer}
                    >
                      {answer}
                    </AnswerButton>
                  ))}
                </Answers>
              </OptionPanel>
            </UserCard>
          </RightPanel>
        </>
      )}
      {time === 0 && (
        <Modal>
          <ModalContent>
            <GameOver>🎉 Game Over! 🎉</GameOver>
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
  background-color: ${colors.blackGray};
  color: ${colors.white};
`;

const LeftPanel = styled.div`
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: space-between;
  padding: 2rem;
`;

const TimeDisplay = styled.span<{ color: string }>`
  color: ${(props) => props.color};
`;

const OptionPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 5rem;
  justify-content: space-between;
  align-items: space-between;
  height: 60vh;
`;

const OptionPanelTitle = styled.h1``;

const QuestionCard = styled.div`
  background-color: ${colors.coolGray};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 8px;
`;

const Image = styled.img`
  max-width: 100%;
  height: 90vh;
  border-radius: 8px;
`;

const UserCard = styled.div`
  background-color: ${colors.coolGray};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-right: 1rem;
  border-color: solid 2px pink;
`;

const Info = styled.div`
  display: flex;
  gap: 0.2rem;
  flex-direction: column;

  h2 {
    margin: 0;
  }
`;

const ScoreText = styled.span`
  font-family: "VIDEOPHREAK", sans-serif;
  font-size: 1.5rem;
`;

const Category = styled.span`
  font-weight: bold;
  font-size: 1rem;
`;

const Answers = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const AnswerButton = styled.button`
  padding: 1rem;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
  background-color: ${colors.lightTurquoise};
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  cursor: pointer;
  background-color: ${colors.lightTurquoise}; // Button background
  color: ${colors.blackGray}; // Button text color
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: ${colors.neonTurquoise}; // Hover background color
    box-shadow: 0 4px 12px ${colors.neonTurquoise}; // Hover shadow
  }

  &::first-letter {
    text-transform: capitalize;
  }
`;

const Modal = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); // Semi-transparent background
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${colors.blackGray}; // Dark background
  color: ${colors.offWhite}; // Light text color
  padding: 2rem;
  text-align: center;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 90%;
  position: relative;
`;

const GameOver = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: ${colors.neonTurquoise}; // Accent color
`;

export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  cursor: pointer;
  background-color: ${colors.lightTurquoise}; // Button background
  color: ${colors.blackGray}; // Button text color
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: ${colors.neonTurquoise}; // Hover background color
    box-shadow: 0 4px 12px ${colors.neonTurquoise}; // Hover shadow
  }
`;
