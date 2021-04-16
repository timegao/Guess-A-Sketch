import { updateMessages, updateLines } from "./redux/actions";
import store from "./redux/store";

/** CLIENT CONFIGURATION - connect to the server */
const socketIOClient = require("socket.io-client");

// When deployed, connect to the hosted server, otherwise connect to local server
// Localhost port must match server
let host =
  process.env.NODE_ENV === "production"
    ? "appname.herokuapp.com"
    : "localhost:4002";
let socket = socketIOClient.connect(host, { secure: true });
// Checks which host we're connected to (for troubleshooting);
console.log("connected to " + host);

socket.on("hello", (message) => {
  console.log(message);
});

socket.on("all messages", (messages) => {
  store.dispatch(updateMessages(messages));
});

socket.on("all lines", (lines) => {
  store.dispatch(updateLines(lines));
});

export const joinChat = (username, date) => {
  socket.emit("join", username, date);
};

export const addMessage = (message) => {
  socket.emit("new message", message);
};

export const addLine = (line) => {
  socket.emit("new line", line);
};
