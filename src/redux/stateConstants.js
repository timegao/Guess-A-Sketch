const {
  faUserNinja,
  faUserAstronaut,
  faUserTie,
  faUser,
  faUserSecret,
} = require("@fortawesome/free-solid-svg-icons");

const AVATAR_MAP = {
  "I'm a Spy": faUserSecret,
  "I'm an Astronaut": faUserAstronaut,
  "I'm a Ninja": faUserNinja,
  "I'm all Business": faUserTie,
  "I'm pretty Average": faUser,
};

const ROLE = {
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
  CLOSE_GUESS: "close guess",
  ALREADY_GUESSED: "already guessed",
  TURN_START: "drawing now",
};

const GAME_STATE = {
  GAME_WAITING: "game waiting", // Players are in loading screen
  TURN_START: "turn start", // Drawer sees word to choose from, guesser sees waiting for drawer to choose word
  TURN_DURING: "turn during", // Drawer draws word, guesser tries to guess word
  TURN_END: "turn end", // Each player sees their updated score
  GAME_OVER: "game over", // Each player sees all standings
};

const DURATION = {
  GAME_WAITING: Infinity,
  TURN_START: 15000,
  TURN_DURING: 90000,
  TURN_END: 8000,
  GAME_OVER: 10000,
};

const LOGIN = {
  LOGGED_OUT: "logged out",
  VALID: "valid username",
  INVALID: "invalid username",
};

// Represents all messages in the game
const INITIAL_MESSAGES = [];

// Represents all lines drawn on the canvas
const INITIAL_LINES = [];

// Represents all players in the game
const INITIAL_USERS = {};

// Represents the single player playing
const INITIAL_PLAYER = {
  player: {},
  login: LOGIN.LOGGED_OUT,
};

const INITIAL_GAME = {
  gameState: GAME_STATE.GAME_WAITING,
  timer: Infinity,
  round: 1,
  hint: "",
};

const INITIAL_SCORING = {
  score: 0, // the total accumulated score
  earned: 0, // the amount of points user earned for the turn
  order: 0, // the order that user guessed correctly
  timer: 0, // tracks the game.timer when player guessed correctly
};

// Represents choices given to drawer
// And the word that they picked to draw
const INITIAL_WORD = {
  choices: {},
  picked: "",
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
  ROLE,
  MESSAGE_TYPE,
  GAME_STATE,
  DURATION,
  INITIAL_MESSAGES,
  INITIAL_LINES,
  INITIAL_USERS,
  INITIAL_PLAYER,
  INITIAL_GAME,
  INITIAL_SCORING,
  INITIAL_STROKE,
  INITIAL_WORD,
  ERASER_STROKE,
  LOGIN,
  AVATAR_MAP,
};
