import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";

const App = () => {
  const socket = useMemo(() => io("http://localhost:8000"), []);
  const [message, setMessage] = useState("");
  const [socketId, setSocketId] = useState("");
  const [userSocketId, setUserSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState([]);

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("Hello");
    socket.emit("message", { message, userSocketId });
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", room);
    setRoom("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
      setSocketId(socket.id);

      socket.on("receive-message", (message) => {
        setMessages((prev) => [...prev, message]);
      });

      // socket.on("welcome", (message) => {
      //   console.log(message);
      // });
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <Container>
      <Typography variant="h4" component={"div"} gutterBottom>
        Welcome to Socket.Io
      </Typography>

      <div>
        <form
          onSubmit={joinRoomHandler}
          className=" flex gap-4 items-center justify-content-center flex-col "
        >
          <TextField
            onChange={(e) => setRoom(e.target.value)}
            value={room}
            id="outlined-basic"
            label="Room Name"
            variant="outlined"
          />
          <Button variant="contained" type="submit">
            Join Room
          </Button>
        </form>
      </div>

      <form
        onSubmit={submitHandler}
        className=" flex gap-4 items-center justify-content-center flex-col "
      >
        <Typography variant="h6" component={"div"} gutterBottom>
          {socketId}
        </Typography>
        <TextField
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          id="outlined-basic"
          label="Message"
          variant="outlined"
        />
        <TextField
          onChange={(e) => setUserSocketId(e.target.value)}
          value={userSocketId}
          id="outlined-basic"
          label="Room ID"
          variant="outlined"
        />
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </form>

      <Stack spacing={2}>
        {messages.map((message, index) => (
          <Typography key={index}>{message}</Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
