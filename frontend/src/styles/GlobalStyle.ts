import { createGlobalStyle } from "styled-components";
import { colors } from "./colors";

const GlobalStyle = createGlobalStyle`
@font-face {
    font-family: 'PPTelegraf';
    src: url('../assets/fonts/pptelegraf-regular.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'PPTelegraf';
    src: url('../assets/fonts/pptelegraf-ultrabold.otf') format('opentype');
    font-weight: bold;
    font-style: normal;
  }

  @font-face {
    font-family: 'PPTelegraf';
    src: url('../assets/fonts/pptelegraf-ultralight.otf') format('opentype');
    font-weight: 300;
    font-style: normal;
  }

  @font-face {
    font-family: 'VIDEOPHREAK';
    src: url('../assets/fonts/VIDEOPHREAK.tff') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  body {
    background-color: ${colors.washedBlue};
    font-family: 'PPTelegraf', sans-serif;
  } 

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

`;

export default GlobalStyle;
