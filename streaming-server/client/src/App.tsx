import { ApolloProvider } from "@apollo/client";
import { client } from "./lib/apollo";
import { GlobalStyle } from "./styles/global";
import { Home } from "./pages/Home";
import { ThemeProvider } from "styled-components";
import { defaultTheme } from "./styles/theme/default";

export function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={defaultTheme}>
        <Home />
        <GlobalStyle />
      </ThemeProvider>
    </ApolloProvider>
  );
}
