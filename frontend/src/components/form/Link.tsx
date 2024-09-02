import styled from "styled-components";
import { colors } from "../../styles/colors";

export const Link = styled.a`
  color: ${colors.washedBlue};
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;
