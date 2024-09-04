import styled from "styled-components";
import { Link as RouterLink } from "react-router-dom";
import { colors } from "../../styles/colors";

export const Link = styled(RouterLink)`
  color: ${colors.washedBlue};
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;
