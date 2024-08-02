import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import styled from "styled-components";
import { colors } from "../styles/colors";
import { Button } from "./Game";

const SignUp: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [degreeProgram, setDegreeProgram] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const { login } = useContext(AuthContext)!;

  const ORTDegreePrograms = [
    "LICENCIATURA EN INFORMATICA",
    "INGENIERIA ELECTRICA",
    "INGENIERIA EN ELECTRONICA",
    "INGENIERIA EN SISTEMAS",
    "INGENIERIA EN TELECOMUNICACIONES",
    "LICENCIATURA EN SISTEMAS",
    "INGENIERIA - POSTGRADO",
    "INGENIERIA - CARRERA CORTA",
    "OTRAS",
  ];

  const UMDegreePrograms = [
    "INENIERIA EN INFORMATICA",
    "INGENIERIA TELEMATICA",
    "INGENIERIA DE DATOS E INTELIGENCIA ARTIFICIAL",
    "INGENIERIA CIVIL",
    "INGENIERIA INDUSTRIAL",
    "CIENCIA DE DATOS PARA NEGOCIOS",
    "OTRAS",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("auth/signup", {
        full_name: fullName,
        email,
        degree_program: degreeProgram,
        academic_year: +academicYear,
      });

      login(response.data.access_token);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Job Fair Registry</Title>
        <Subtitle>
          Please enter your details in order to start playing 🎮.
        </Subtitle>
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
        <SelectWrapper>
          <Select
            value={degreeProgram}
            onChange={(e) => setDegreeProgram(e.target.value)}
            required
          >
            <option value="" disabled>
              Degree Program
            </option>
            {UMDegreePrograms.map((e) => {
              return <option value={e}>{e}</option>;
            })}
          </Select>
        </SelectWrapper>
        {/* <Input
          type="number"
          min="1"
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
          placeholder="Current Academic Year"
          required
        /> */}
        <SelectWrapper>
          <Select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            required
          >
            <option value="" disabled>
              Academic Year
            </option>
            {[1, 2, 3, 4, 5].map((e) => {
              return <option value={e}>{e}</option>;
            })}
          </Select>
        </SelectWrapper>
        <Button type="submit">Sign up</Button>
        <Footer>
          <p>Already have an account?</p>
          <Link href="/login">Log in here</Link>
        </Footer>
      </Form>
    </Container>
  );
};

export default SignUp;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${colors.blackGray};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: ${colors.coolGray};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px ${colors.gray};
  max-width: 400px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${colors.offWhite};
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${colors.offWhite};
  margin-bottom: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid ${colors.coolGray};
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: ${colors.lightTurquoise};
  }
`;

const SelectWrapper = styled.div`
  position: relative;

  &::after {
    content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAUCAMAAACtdX32AAAAdVBMVEUAAAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhMdQaAAAAJ3RSTlMAAAECAwQGBwsOFBwkJTg5RUZ4eYCHkJefpaytrsXGy8zW3+Do8vNn0bsyAAAAYElEQVR42tXROwJDQAAA0Ymw1p9kiT+L5P5HVEi3qJn2lcPjtIuzUIJ/rhIGy762N3XaThqMN1ZPALsZPEzG1x8LrFL77DHBnEMxBewz0fJ6LyFHTPL7xhwzWYrJ9z22AqmQBV757MHfAAAAAElFTkSuQmCC);
    background-position: 100%;
    font-size: 1rem;
    top: 15px;
    right: 5px;
    position: absolute;
    pointer-events: none;
    color: ${colors.blackGray};
  }
`;

const Select = styled.select`
  color: ${colors.coolGray};
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid ${colors.coolGray};
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s ease;
  appearance: none; /* Remove default arrow */
  background: none; /* Remove default background */
  width: 100%;
  background: white;

  &:focus {
    border-color: ${colors.lightTurquoise};
  }
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${colors.gray};
`;

const Link = styled.a`
  color: ${colors.lightTurquoise};
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;
