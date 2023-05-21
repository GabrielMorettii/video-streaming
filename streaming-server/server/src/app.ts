import "reflect-metadata";
import "dotenv/config";

import express from "express";
import http from "http";
import cors from 'cors';
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import { Server } from "socket.io";

import { FilesResolver } from "./modules/files/resolvers/file-resolver";
import { notificationsHandler } from "./modules/notifications/handlers/notification-handler";

const app = express();

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const buildApolloServer = async () => {
  const schema = await buildSchema({
    resolvers: [FilesResolver],
  });

  const server = new ApolloServer({
    schema,
    csrfPrevention: false,
  });

  await server.start();

  app.use(express.json());

  app.use(graphqlUploadExpress());

  server.applyMiddleware({
    app,
    bodyParserConfig: {
      limit: "50mb",
    },
  });

  return { app, server };
};

io.on("connection", notificationsHandler);

export { buildApolloServer, io, httpServer };
