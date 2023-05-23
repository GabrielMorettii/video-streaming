import { io } from "socket.io-client";

const isLocal = import.meta.env.DEV

const uri = isLocal ? import.meta.env.VITE_WS_SERVER_URL : '';

export const socket = io(uri, {
  path: "/socket.io"
})