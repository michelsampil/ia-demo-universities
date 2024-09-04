import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { Container } from "./Container";
import { Button } from "./form/Button";
import { BlendIcon } from "./BlendIcon";
import { Form } from "./Form";
import { Link } from "./form/Link";
import { Input } from "./form/Input";
import { Footer } from "./form/Footer";
import { Subtitle } from "./form/Subtitle";
import { Title } from "./form/Title";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Toast = styled.div<{ show: boolean }>`
  display: ${(props) => (props.show ? "block" : "none")};
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #ff073a;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.5s ease-in-out;
  z-index: 1000;
`;

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null); // Reset error message before attempting login
    try {
      const response = await api.post("auth/signup", {
        email,
      });

      login(response.data.access_token);
      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
      setErrorMessage("Login failed. Please check your email and try again.");
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Welcome back</Title>
        <Subtitle>Ready for a rematch? Let's play again!</Subtitle>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <Button type="submit">Log in</Button>
        <Footer>
          <p>Don't have an account?</p>
          <Link to="/signup">Sign up</Link>
        </Footer>
        <BlendIcon />
      </Form>
      <Toast show={errorMessage !== null}>{errorMessage}</Toast>
    </Container>
  );
};

export default Login;
