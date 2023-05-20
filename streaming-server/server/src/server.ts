import { buildApolloServer, httpServer } from "./app";

const PORT = process.env.SERVER_PORT || 5000;

async function bootstrap() {
  const { server } = await buildApolloServer();

  httpServer.listen({ port: PORT }, () => {
    console.log(
      `Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
};

bootstrap();
