import React from "react";
import ReactDOM from "react-dom/client";

import { ApolloProvider } from "@apollo/client";

import App from "./App.tsx";

import { client } from "./lib/apollo.ts";
import { GlobalStyle } from './styles/global'



ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
      <GlobalStyle />
    </ApolloProvider>
  </React.StrictMode>
);
