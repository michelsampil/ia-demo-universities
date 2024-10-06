import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import styled, { keyframes } from "styled-components";
import { colors } from "../styles/colors";
import { BlendIcon } from "./BlendIcon";
import { Container } from "./Container";
import { Form } from "./Form";
import { Footer } from "./form/Footer";
import { Title } from "./form/Title";
import { Input } from "./form/Input";
import { Button } from "./form/Button";
import { Link } from "./form/Link";

const SignUp: React.FC = () => {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [university, setUniversity] = useState<string>("");
  const [degreeType, setDegreeType] = useState<string>("");
  const [degreeProgram, setDegreeProgram] = useState<string>("");
  const [customDegreeProgram, setCustomDegreeProgram] = useState<string>("");
  const [academicYear, setAcademicYear] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login } = useContext(AuthContext)!;
  const navigate = useNavigate();

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
      "DIPLOMA DE ESPECIALIZACION EN GESTION DE SISTEMAS DE INFORMACION",
      "DIPLOMA DE ESPECIALIZACION EN INTELIGENCIA ARTIFICIAL",
      "MASTER EN BIGDATA",
      "MASTER EN GESTION DE SISTEMAS DE INFORMACION",
      "MASTER DE INGENIERIA (POR INVESTIGACION)",
    ],
  };

  const UMDegreePrograms: string[] = [
    "LICENCIATURA EN INFORMATICA",
    "INGENIERIA EN INFORMATICA",
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
      navigate("/");
    } catch (error) {
      setErrorMessage(
        "Can't sign up. Please check if you are already registered."
      );
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Welcome</Title>
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
        <SelectWrapper>
          <Select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            required
          >
            <option value="" disabled>
              Select Academic Year
            </option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="Graduated">Graduated</option>
          </Select>
        </SelectWrapper>

        <Button type="submit">Sign up</Button>
        <Footer>
          <span>Already played?</span>
          <Link to="/login">Log in</Link>
        </Footer>
        <BlendIcon />
        {errorMessage && <Toast>{errorMessage}</Toast>}
      </Form>
    </Container>
  );
};

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

const Toast = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: ${colors.neonRed};
  color: ${colors.white};
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.3s ease-in-out;
`;

export const Select = styled.select`
  color: ${colors.coolGray};
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid ${colors.white};
  border-radius: 16px;
  outline: none;
  transition: border-color 0.3s ease;
  appearance: none;
  background: none;
  width: 100%;
  background: white;

  &:focus {
    border-color: ${colors.lightTurquoise};
  }
`;

export const SelectWrapper = styled.div`
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

export default SignUp;
