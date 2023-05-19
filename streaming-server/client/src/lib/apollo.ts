import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createUploadLink({
    uri: import.meta.env.VITE_SERVER_URL,
  }),
});
