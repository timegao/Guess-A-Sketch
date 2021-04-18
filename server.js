/** SERVER CONFIGURATION */
const express = require("express");
const app = express();
const server = require("http").Server(app);
// The origin is used by CORS
const origin =
  process.env.NODE_ENV === "production"
    ? "app-name.herokuapp.com"
    : "http://localhost:3000";
const io = require("socket.io")(server, {
  cors: {
    origin: origin,
    methods: ["GET", "POST"],
  },
});
console.log("Websocket server created");

// Choose a port, default is 4002 (could be almost anything)
const PORT = process.env.PORT || 4002;

app.use(express.static(__dirname + "/"));

const MESSAGE_TYPE = {
  JOIN: "join",
  LEAVE: "leave",
  ANSWER: "answer",
  REGULAR: "regular",
  GAME_OVER: "game over",
  CORRECT: "correct guess",
};

let messages = [];
let lines = [];

// Object to map client ids to their usernames
const clients = {};
// Listen for client connections
server.listen(PORT, () => console.log(`Listening on ${PORT}`));

const processMessage = (message) => {
  messages.push(message);
  io.sockets.emit("all messages", messages);
};

io.on("connection", (client) => {
  client.emit("hello", "Server says hello");

  client.on("disconnect", () => {
    if (clients.hasOwnProperty(client.id)) {
      processMessage({
        username: clients[client.id].username,
        text: `${clients[client.id].username} has left the chat`,
        type: MESSAGE_TYPE.LEAVE,
      });
      delete clients[client.id];
      io.sockets.emit("all users", clients);
    }
  });

  client.on("join", (username, date) => {
    clients[client.id] = {
      username,
      score: 0,
      role: "guesser",
      onboarded: false,
      joinedTimeStamp: date,
    };
    messages.push({
      username,
      text: `${username} has joined the chat!`,
      type: MESSAGE_TYPE.JOIN,
    });
    io.sockets.emit("all messages", messages);
    io.sockets.emit("all users", clients);
  });

  client.on("new message", (message) => {
    messages.push(message);
    io.sockets.emit("all messages", messages);
  });

  client.on("new line", (line) => {
    lines.push(line);
    io.sockets.emit("all lines", lines);
  });
});
