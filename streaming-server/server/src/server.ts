import { buildApolloServer, httpServer } from "./app";

const PORT = process.env.SERVER_PORT || 5000;

async function bootstrap() {
  await buildApolloServer();

  httpServer.listen({ port: PORT }, () => {
    console.log(
      `Server listening on port ${PORT}`
    );
  });
};

bootstrap();
