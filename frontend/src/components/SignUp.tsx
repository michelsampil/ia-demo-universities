import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import styled from "styled-components";
import { colors } from "../styles/colors";
import { Button } from "./Game";

const SignUp: React.FC = () => {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [university, setUniversity] = useState<string>("");
  const [degreeType, setDegreeType] = useState<string>("");
  const [degreeProgram, setDegreeProgram] = useState<string>("");
  const [customDegreeProgram, setCustomDegreeProgram] = useState<string>("");
  const [academicYear, setAcademicYear] = useState<number | "">("");
  const { login } = useContext(AuthContext)!;

  const ORTDegreeTypes: string[] = [
    "CARRERAS UNIVERSITARIAS - INGENIERIA",
    "CARRERAS CORTAS - INGENIERIA",
    "POSTGRADOS - INGENIERIA",
    "OTRAS",
  ];

  const ORTDegreePrograms: { [key: string]: string[] } = {
    "CARRERAS UNIVERSITARIAS - INGENIERIA": [
      "INGENIERIA ELECTRICA",
      "INGENIERIA EN ELECTRONICA",
      "INGENIERIA EN SISTEMAS",
      "INGENIERIA EN TELECOMUNICACIONES",
      "LICENCIATURA EN SISTEMAS",
    ],
    "CARRERAS CORTAS - INGENIERIA": [
      "ADMINISTRADOR DE SERVIDORES Y APLICACIONES",
      "ANALISTA EN INFRAESTRUCTURA INFORMATICA",
      "ANALISTA EN TECNOLOGIAS DE LA INFORMACION",
      "ANALISTA PROGRAMADOR",
    ],
    "POSTGRADOS - INGENIERIA": [
      "DIPLOMA DE ESPECIALIZACION EN ANALITICA DE BIGDATA",
      "DIPLOMA DE ESPECIALIZACION EN CIBERSEGURIDAD",
      "DIPLOMA DE ESPECIALIZACION EN GESTION DE SIETMAS DE INFORMACION",
      "DIPLOMA DE ESPECIALIZACION EN INTELIGENCIA ARTIFICIAL",
      "MASTER EN BIGDATA",
      "MASTER EN GESTION DE SISTEMAS DE INFORMACION",
      "MASTER DE INGENIERIA (POR INVESTIGACION)",
    ],
  };

  const UMDegreePrograms: string[] = [
    "LICENCIATURA EN INFORMATICA",
    "INENIERIA EN INFORMATICA",
    "INGENIERIA TELEMATICA",
    "INGENIERIA DE DATOS E INTELIGENCIA ARTIFICIAL",
    "INGENIERIA CIVIL",
    "INGENIERIA INDUSTRIAL",
    "CIENCIA DE DATOS PARA NEGOCIOS",
    "OTRAS",
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const selectedDegreeProgram =
      degreeProgram === "OTRAS" ? customDegreeProgram : degreeProgram;
    try {
      const response = await api.post("auth/signup", {
        full_name: fullName,
        email,
        degree_program: selectedDegreeProgram,
        academic_year: academicYear,
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
            value={university}
            onChange={(e) => {
              setUniversity(e.target.value);
              setDegreeType("");
              setDegreeProgram("");
            }}
            required
          >
            <option value="" disabled>
              Select University
            </option>
            <option value="UM">UM</option>
            <option value="ORT">ORT</option>
          </Select>
        </SelectWrapper>
        {university === "ORT" && (
          <SelectWrapper>
            <Select
              value={degreeType}
              onChange={(e) => {
                setDegreeType(e.target.value);
                setDegreeProgram("");
              }}
              required
            >
              <option value="" disabled>
                Select Degree Type
              </option>
              {ORTDegreeTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </SelectWrapper>
        )}
        {((university === "ORT" && degreeType && degreeType !== "OTRAS") ||
          university === "UM") && (
          <SelectWrapper>
            <Select
              value={degreeProgram}
              onChange={(e) => setDegreeProgram(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Degree Program
              </option>
              {(university === "UM"
                ? UMDegreePrograms
                : ORTDegreePrograms[degreeType] || []
              ).map((program) => (
                <option key={program} value={program}>
                  {program}
                </option>
              ))}
            </Select>
          </SelectWrapper>
        )}
        {(degreeProgram === "OTRAS" ||
          (degreeType === "OTRAS" && university === "ORT")) && (
          <Input
            type="text"
            value={customDegreeProgram}
            onChange={(e) => setCustomDegreeProgram(e.target.value)}
            placeholder="Enter your degree program"
            required
          />
        )}
        <Input
          type="number"
          min="1"
          value={academicYear}
          onChange={(e) => setAcademicYear(Number(e.target.value))}
          placeholder="Current Academic Year"
          required
        />
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
    top: 50%;
    right: 10px;
    position: absolute;
    pointer-events: none;
    color: ${colors.blackGray};
    transform: translateY(-50%);
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
