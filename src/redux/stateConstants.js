const ROLES = {
  DRAWER: "drawer",
  GUESSER: "guesser",
};

const MESSAGE_TYPE = {
  JOIN: "join",
  LEAVE: "leave",
  ANSWER: "answer",
  REGULAR: "regular",
  GAME_OVER: "game over",
  CORRECT: "correct guess",
};

const GAME_STATE = {
  GAME_WAITING: "game waiting",
  ROUND_START: "round start",
  ROUND_DURING: "round during",
  ROUND_END: "round end",
  GAME_OVER: "game over",
};

const INITIAL_MESSAGES = [];

const INITIAL_LINES = [];

// Represents all players in the game
const INITIAL_USERS = {};

// Represents the single player playing
const INITIAL_PLAYER = {};

const INITIAL_GAME = {
  gameState: GAME_STATE.GAME_WAITING,
  timer: Infinity,
  round: 1,
};

// Used to start drawing against white background
const INITIAL_STROKE = {
  lineWidth: 8,
  color: "#000000", // black
};

// Used to erase by drawing against white background
const ERASER_STROKE = {
  lineWidth: 64,
  color: "#ffffff", // white
};

// Changes exports to CommonJS Syntax so that they can be imported to server.js
module.exports = {
  ROLES,
  MESSAGE_TYPE,
  GAME_STATE,
  INITIAL_MESSAGES,
  INITIAL_LINES,
  INITIAL_USERS,
  INITIAL_PLAYER,
  INITIAL_GAME,
  INITIAL_STROKE,
  ERASER_STROKE,
};
