import { Server } from "socket.io";
import config from "config";

const port = config.get<number>("port");

const server = new Server(port, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

server.on("connection", (socket) => {
  console.log("client connected:", socket.id);

  // Handle user follow events
  socket.on("user-followed", (data: any) => {
    console.log("user-followed event:", data);
    server.emit("user-followed", data);
  });

  socket.on("user-unfollowed", (data: any) => {
    console.log("user-unfollowed event:", data);
    server.emit("user-unfollowed", data);
  });

  socket.on("disconnect", () => {
    console.log("client disconnected:", socket.id);
  });
});

console.log(`Socket.IO server started on port ${port}`);
