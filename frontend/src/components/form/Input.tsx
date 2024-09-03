import styled from "styled-components";
import { colors } from "../../styles/colors";

export const Input = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid ${colors.white};
  border-radius: 16px;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: ${colors.lightTurquoise};
  }
`;
