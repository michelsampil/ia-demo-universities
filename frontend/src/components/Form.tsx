import { colors } from "../styles/colors";
import styled from "styled-components";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: ${colors.tourqueeseStrong};
  padding: 2rem;
  border-radius: 30px;
  box-shadow: 0 4px 8px ${colors.gray};
  max-width: 400px;
  width: 100%;
`;
