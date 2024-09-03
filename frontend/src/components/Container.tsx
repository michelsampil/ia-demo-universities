import BlendBackground from "../assets/images/blend-background.svg";
import styled from "styled-components";
import { colors } from "../styles/colors";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: ${colors.washedBlue};
  background-image: url(${BlendBackground});
  background-repeat: no-repeat;
  background-size: 100%; /* Scale down the SVG */
  background-position: center;
`;
