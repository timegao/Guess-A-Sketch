import {
  updateMessages,
  updateLines,
  updateUsers,
  addPlayer,
  setGameWaiting,
  setTurnStart,
  setTurnDuring,
  setTurnEnd,
  setGameOver,
  countdownTimer,
  updateGame,
  setWordChoices,
  setWordToGuess,
  invalidUsername,
} from "./redux/actions";
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

socket.on("all messages", (message) => {
  store.dispatch(updateMessages(message));
});

socket.on("all lines", (lines) => {
  store.dispatch(updateLines(lines));
});

socket.on("all users", (users) => {
  store.dispatch(updateUsers(users));
});

socket.on("add player", (user) => {
  store.dispatch(addPlayer(user));
});

socket.on("game waiting", () => {
  store.dispatch(setGameWaiting());
});

socket.on("turn start", () => {
  store.dispatch(setTurnStart());
});

socket.on("turn during", () => {
  store.dispatch(setTurnDuring());
});

socket.on("turn end", () => {
  store.dispatch(setTurnEnd());
});

socket.on("game over", () => {
  store.dispatch(setGameOver());
});

socket.on("countdown timer", () => {
  store.dispatch(countdownTimer());
});

socket.on("update game", (game) => {
  store.dispatch(updateGame(game));
});

socket.on("choose word", (choices) => {
  store.dispatch(setWordChoices(choices));
});

socket.on("auto choose word", (word) => {
  store.dispatch(setWordToGuess(word));
});

socket.on("invalid username", () => {
  store.dispatch(invalidUsername());
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

export const getWordsToChooseFrom = () => {
  socket.emit("get words to choose from");
};

export const drawerChoseWord = (word) => {
  socket.emit("new word", word);
};
