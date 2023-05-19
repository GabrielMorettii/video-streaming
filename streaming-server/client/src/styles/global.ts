import { createGlobalStyle } from 'styled-components'

import "plyr-react/plyr.css";

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  body {
    background: ${(props) => props.theme.colors['base-background']};
    font-family: 'Poppins', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  html, body, #root {
    height: 100%;
  }
`
