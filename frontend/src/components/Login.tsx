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

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const { login } = useContext(AuthContext)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("auth/signup", {
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
        <Title>Welcome back</Title>
        <Subtitle> Ready for a rematch? Let's play again!</Subtitle>
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
          <Link href="/signup">Sign up</Link>
        </Footer>
        <BlendIcon />
      </Form>
    </Container>
  );
};

export default Login;
