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
                src="data:image/jpeg;base64,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"
                alt="User Avatar"
              />
              <Info>
                <h2>{user.username}</h2>
                <span>Score: 100</span>
                <TimeDisplay color={getTimeColor}>Time: {time}s</TimeDisplay>
                <span>Category: {question.category}</span>
              </Info>
            </UserCard>
            <UserCard>
              <OptionPanel>
                <OptionPanelTitle>
                  🤔 What's the image meaning:
                </OptionPanelTitle>
                <Answers>
                  {question?.options?.map((answer, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswer(answer)}
                      disabled={!!selectedAnswer}
                    >
                      {answer}
                    </Button>
                  ))}
                </Answers>
                <ConfirmButton
                  onClick={() => handleAnswer(selectedAnswer || "")}
                  disabled={!selectedAnswer}
                >
                  Confirm
                </ConfirmButton>
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
  height: auto;
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

const Answers = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const AnswerButton = styled.button`
  padding: 1rem;
  font-size: 1.2rem;
  cursor: pointer;
  background-color: ${colors.lightTurquoise};
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  &:disabled {
    background-color: ${colors.coolGray};
    cursor: not-allowed;
  }
`;

const ConfirmButton = styled.button`
  padding: 1rem;
  font-size: 1.2rem;
  cursor: pointer;
  background-color: ${colors.washedBlue};
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  &:disabled {
    background-color: ${colors.gray};
    cursor: not-allowed;
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

const Button = styled.button`
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
