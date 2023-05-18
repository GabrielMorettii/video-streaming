import "reflect-metadata";
import "dotenv/config";
import express from 'express';
import { buildSchema } from "type-graphql";
import { FilesResolver } from "./resolvers/file-resolver";
import { ApolloServer } from 'apollo-server-express';
import { graphqlUploadExpress } from "graphql-upload";

const PORT = process.env.SERVER_PORT || 5000;

(async () => {
  const schema = await buildSchema({
    resolvers: [FilesResolver],
  });

  const server = new ApolloServer({
    schema,
    csrfPrevention: false
  });

  await server.start();

  const app = express();

  app.use(graphqlUploadExpress());

  server.applyMiddleware({ app });

  app.listen({ port: PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`)
  }
);})();
