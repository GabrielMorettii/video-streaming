import server from "./app";

const PORT = process.env.SERVER_PORT || 5000;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});
