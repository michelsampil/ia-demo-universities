import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import styled from "styled-components";
import { colors } from "../styles/colors";

const Login: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const { login } = useContext(AuthContext)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("auth/login", {
        full_name: fullName,
        email,
      });

      login(response.data.access_token);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h1>Registry</h1>
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
          required
        />
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <Button type="submit">Login</Button>
      </Form>
    </Container>
  );
};

export default Login;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${colors.offWhite};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: ${colors.white};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px ${colors.gray};
`;

const Input = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid ${colors.coolGray};
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  background-color: ${colors.lightTurquoise};
  color: ${colors.darkGray};
  border: none;
  border-radius: 4px;

  &:hover {
    background-color: ${colors.neonTurquoise};
  }
`;
