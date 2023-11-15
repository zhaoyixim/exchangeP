// Socket.io.ts

import { io } from "socket.io-client";

export default {
  install: (app, { connection, options }) => {
    const socket = io(connection, options);
    socket.on('connect',()=>console.log("链接成功"))
    app.config.globalProperties.$socket = socket;
    app.provide("socket", socket);
  },
};