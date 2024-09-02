import { colors } from "../../styles/colors";
import styled from "styled-components";

export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  cursor: pointer;
  background-color: ${colors.washedBlue};
  color: ${colors.white};
  border: none;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: ${colors.washedBlue};
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }
`;
