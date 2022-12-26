import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import { createGlobalStyle } from 'styled-components';

import { App } from 'App';

if (process.env.REACT_APP_GA_TRACKING_ID) {
  ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);
  ReactGA.pageview(window.location.pathname + window.location.search);
}

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URL,
  cache: new InMemoryCache(),
});

const GlobalStyle = createGlobalStyle`
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
`;

ReactDOM.render(
  <ApolloProvider client={client}>
    <GlobalStyle />
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
