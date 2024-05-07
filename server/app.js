import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { log } from "console";
import cors from "cors";

const PORT = 8000;

const app = express();

const server = new createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  //   socket.emit("welcome", `Welocme to server`);
  //   socket.broadcast.emit("welcome", `${socket.id} New user connected`);

  socket.on("message", ({ message, userSocketId }) => {
    console.log({ message, userSocketId });
    socket.to(userSocketId).emit("receive-message", message);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log("User Joined Room", room);
    // socket.emit("joined-room", room);
    // socket.broadcast.to(room).emit("user-connected", room);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
