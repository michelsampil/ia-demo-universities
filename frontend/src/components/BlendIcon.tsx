import BlendIconSVG from "../assets/images/blend-logo.svg";
import styled from "styled-components";

export const BlendIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(${BlendIconSVG});
  background-repeat: no-repeat;
  background-size: 43%;
  background-position: center;
  height: 2.5rem;
`;
