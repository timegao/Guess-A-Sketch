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
const path = require("path");

// Choose a port, default is 4002 (could be almost anything)
const PORT = process.env.PORT || 4002;

// When on Heroku, serve the UI from the build folder
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "build")));
  app.get("*", (res) => {
    res.sendfile(path.join((__dirname = "build/index.html")));
  });
}

// When on local host, server from the public folder.
// Rule will not be written if production conditional has executed
app.get("*", () => {
  app.sendFile(path.join(__dirname + "public/index.html"));
});

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
    if (clients.hasOwnProperty(client.id))
      processMessage(clients[client.id] + " has left the chat");
  });

  client.on("join", (username) => {
    messages.push(`${username} has joined the chat`);
    io.sockets.emit("all messages", messages);
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
