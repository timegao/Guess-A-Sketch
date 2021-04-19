/** SERVER CONFIGURATION */
const express = require("express");
const {
  INITIAL_GAME,
  MESSAGE_TYPE,
  ROLES,
} = require("./src/redux/stateConstants");
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

let messages = []; // Array of messages sent to users
let lines = []; // Array of lines drawn on Canvas
let word = ""; // Word for users to guess
let game = INITIAL_GAME;

const clients = {}; // Object to map client ids to their usernames

// Listen for client connections
server.listen(PORT, () => console.log(`Listening on ${PORT}`));

const processMessage = (message) => {
  messages.push(message);
  io.sockets.emit("all messages", messages);
};

io.on("connection", (client) => {
  // Syntax allows us to emit to specific client instead of all clients
  io.to(client.id).emit("hello", `${client.id}`);

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

  let waitingClientId = null;
  client.on("join", (username, date) => {
    clients[client.id] = {
      id: client.id,
      username,
      score: 0,
      role: ROLES.GUESSER,
      onboarded: false,
      joinedTimeStamp: date,
      wait: false,
    };
    messages.push({
      username,
      text: `${username} has joined the chat!`,
      type: MESSAGE_TYPE.JOIN,
    });
    // only 1 player
    if (Object.keys(clients).length === 1) {
      clients[client.id] = {
        ...clients[client.id],
        role: "drawer",
        wait: true, // needs to wait for other player
      };
      waitingClientId = client.id;
      client.emit("wait for another player", clients[client.id]);
      io.to(client.id).emit("add player", clients[client.id]); // trigger adding of player in redux
      return; // Do not send all messages  or all user to all clients
    }
    if (waitingClientId) {
      clients[waitingClientId] = { ...clients[waitingClientId], wait: false };
    }
    io.to(client.id).emit("add player", clients[client.id]); // trigger adding of player in redux
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
