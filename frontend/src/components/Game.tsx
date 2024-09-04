import React, { useState, useEffect, useContext, useMemo } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { colors } from "../styles/colors";
import { StyledCard } from "./Card";
import ChessboardReveal from "./ChessboardReveal";
import Podium from "./Podium"; // Import the Podium component
import ScoreBox from "./ScoreBox";
import Avatar from "./Avatar";
interface Question {
  id: number;
  image_url: string;
  options: string[];
  correctAnswer: string;
  category: string;
}

interface Score {
  username: string;
  score: number;
  position: number;
}

const Game: React.FC = () => {
  const { token, user } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | null>(null);
  const [time, setTime] = useState<number>(30);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [score, setScore] = useState(0);
  const [pointsMessage, setPointsMessage] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [topThree, setTopThree] = useState<Score[]>([]); // State to hold top 3 players

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");
    setSocket(ws);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          event: "authenticate",
          token: token || localStorage.getItem("token"),
        })
      );
      ws.send(
        JSON.stringify({
          event: "start_game",
          message: "Hello from React!",
          token: token || localStorage.getItem("token"),
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.event === "question") {
        setQuestion(data.question);
      } else if (data.event === "time") {
        setTime(data.time);
      } else if (data.event === "time_up") {
        handleTimeUp();
      } else if (data.event === "answer_result") {
        handleAnswerResult(data);
      } else if (data.event === "game_over") {
        handleGameOver(data);
      } else if (data.event === "ranking_update") {
        handleRankingUpdate(data.ranking); // Handle ranking updates
      } else if (
        data.event === "error" &&
        data.message === "Token has expired"
      ) {
        localStorage.removeItem("token");
        navigate("/signup");
      }
    };

    ws.onclose = () => {};

    return () => {
      ws.close();
    };
  }, [token]);

  const handleRankingUpdate = (scores: Score[]) => {
    const topThreePlayers = scores
      .map((e: any) => ({
        username: e.user_email,
        score: e.score,
        position: e.position,
      }))
      .slice(0, 3);
    setTopThree(topThreePlayers); // Update top 3 players
  };

  const handleAnswer = async (answer: string) => {
    socket?.send(
      JSON.stringify({
        event: "answer",
        username: user,
        question_id: question?.id,
        answer: answer,
        token: token || localStorage.getItem("token"),
      })
    );
  };

  const handleAnswerResult = (data: any) => {
    if (data.correct) {
      setPointsMessage(`+${1}pts`);
      setScore(data.score);
    } else {
      setPointsMessage(`0pts`);
    }
    setTimeout(() => setPointsMessage(null), 2000);
  };

  const handleGameOver = (data: any) => {
    setGameOver(true);
    setTimeout(() => setPointsMessage(null), 2000);
  };

  const handleTimeUp = async () => {
    setTime(0);
  };

  const getTimeColor = useMemo(() => {
    if (time > 20) {
      return "lime";
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
          {pointsMessage && (
            <PointsMessage show={!!pointsMessage && !gameOver}>
              {pointsMessage}
            </PointsMessage>
          )}
          <LeftPanel>
            <QuestionCard>
              <ChessboardReveal
                imageUrl={`http://localhost:8000/${question?.image_url?.slice(
                  4
                )}`}
              />
            </QuestionCard>
          </LeftPanel>
          <RightPanel>
            <RightPanelTop>
              <UserCard>
                <Avatar userName={user.user || "example"} />
                <Info>
                  {/* <h2>{user.user}</h2> */}
                  <ScoreText>Score: {score || 0}</ScoreText>
                  <TimeDisplay color={getTimeColor}>Time: {time}s</TimeDisplay>
                  <Category>Category: {question.category}</Category>
                </Info>
              </UserCard>
              <OptionsCard>
                <OptionPanel>
                  <OptionPanelTitle>What's the image meaning?</OptionPanelTitle>
                  <Answers>
                    {question?.options?.map((answer, index) => (
                      <AnswerButton
                        key={`${index}-${question}`}
                        onClick={() => handleAnswer(answer)}
                      >
                        {answer?.split("/")[1].toLowerCase()}
                      </AnswerButton>
                    ))}
                  </Answers>
                </OptionPanel>
              </OptionsCard>
            </RightPanelTop>

            {topThree.length > 0 && <Podium topThree={topThree} />}
          </RightPanel>
        </>
      )}
      {(time === 0 || gameOver) && (
        <Modal>
          <ModalContent>
            <GameOver> Game Over </GameOver>
            <ScoreBox score={score || 0} />
            <GameOverButtonsWrapper>
              <Button onClick={() => navigate("/signup")}> Login </Button>
              <Button onClick={() => navigate("/ranking")}> Ranking</Button>
            </GameOverButtonsWrapper>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Game;

const GameOverButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem; // Small gap between the buttons

  & > button {
    flex: 1; // Each button takes up an equal portion of the available space
  }
`;
const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: space-between; /* Space between LeftPanel and RightPanel */
  align-items: flex-start; /* Aligns children at the top */
  background-color: ${colors.washedBlue};
  background-repeat: no-repeat;
  background-size: 100%; /* Scale down the SVG */
  background-position: center;
  color: ${colors.white};
`;

const LeftPanel = styled.div`
  flex-grow: 1; /* Allows LeftPanel to grow as much as possible */
  display: flex;

  width: 100%; /* Ensure it takes full width available */
  max-width: 100vh; /* Limits the width to maintain a square shape */
  aspect-ratio: 1; /* Maintains square aspect ratio */
  padding: 1rem;
  background-color: ${colors.washedBlue}; /* Optional: for visibility */
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: space-between;
  padding: 1rem;
  height: 100vh;
`;

const RightPanelTop = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: space-between;
  // padding: 1rem;
  gap: 1rem;
`;

const TimeDisplay = styled.span<{ color: string }>`
  font-size: 2rem;
  color: ${(props) => props.color};
  background-color: #${colors.deepBlue};
  padding: 10px;
  border-radius: 16px;
`;

const OptionPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: space-between;
  align-items: space-between;
`;

const OptionPanelTitle = styled.h1`
  color: ${colors.lightTurquoise};
`;

const QuestionCard = styled.div`
  background-color: ${colors.tourqueesePale};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 12px;
  margin: 1rem;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  margin: auto;
`;

const UserCard = styled.div`
  background-color: ${colors.tourqueeseStrong};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 30px;
  display: flex;
  align-items: center;
`;

const OptionsCard = styled.div`
  // background-color: ${colors.coolGray};
  // box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  // padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const Info = styled.div`
  display: flex;
  gap: 0.2rem;
  flex-direction: column;
  color: #${colors.deepBlue};

  h2 {
    margin: 0;
  }
`;

const ScoreText = styled.span`
  font-family: "VIDEOPHREAK", sans-serif;
  font-size: 2rem;
  color: #${colors.deepBlue};
`;

const Category = styled.span`
  color: #${colors.deepBlue};
  font-weight: bold;
  font-size: 1rem;
`;

const Answers = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const AnswerButton = styled.button`
  padding: 1rem;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
  background-color: ${colors.lightTurquoise}; // Button background
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  width: 565px;

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
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); // Semi-transparent background
  z-index: 1000;
`;

const ModalContent = styled.div`
  color: ${colors.offWhite}; // Light text color
  background-color: ${colors.graffito}E6; // Dark background

  padding: 1rem 0 2rem 0;
  text-align: center;
  position: relative;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: center;
  gap: 1rem;

  & > * {
    width: 27%; // Ensures all child elements have the same width
  }
`;

const GameOver = styled.h1`
  font-size: 1.7rem;
  color: ${colors.white}; // Accent color
`;

export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  cursor: pointer;
  background-color: ${colors.tourqueeseBright}; // Button background
  color: ${colors.blackGray}; // Button text color
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const PointsMessage = styled.div<{ show: boolean }>`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(
    255,
    255,
    0,
    0.2
  ); // Semi-transparent yellow background
  color: ${colors.neonYellow}; // Yellow font color
  padding: 0.5rem 1rem;
  font-size: 2rem;
  font-weight: bold;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4); // Cool drop shadow
  z-index: 1001;
  transition: opacity 0.5s ease-in-out, bottom 0.5s ease-in-out;
  opacity: ${(props) => (props.show ? 1 : 0)};
  bottom: ${(props) => (props.show ? "20px" : "0")}; // Slide from bottom
  font-family: "Press Start 2P", cursive; // Game-like font
`;
