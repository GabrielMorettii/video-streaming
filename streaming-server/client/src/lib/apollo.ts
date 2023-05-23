import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";

const isLocal = import.meta.env.DEV

const uri = isLocal ? import.meta.env.VITE_GQL_SERVER_URL : '/graphql';

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createUploadLink({
    uri,
  }),
});
