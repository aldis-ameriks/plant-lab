import { createGlobalStyle } from 'styled-components'

// TODO: Normalize styles
export const GlobalStyles = createGlobalStyle`
  body {
    font-size: 14px;
    margin: 0;
  }

  @media (min-width: 600px) {
    body {
      font-size: 16px;
    }
  }

  * {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
  }

  a {
    color: inherit;
    text-decoration: none;

    :hover {
      text-decoration: none;
    }
  }
`
