/** SERVER CONFIGURATION */
const express = require("express");
const { getWordChoicesData } = require("./src/data/words");
const {
  INITIAL_GAME,
  INITIAL_SCORING,
  MESSAGE_TYPE,
  ROLE,
  DURATION,
  GAME_STATE,
  INITIAL_WORD,
  LOGIN,
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

const BLANK_HINT_TIME = DURATION.TURN_DURING; // @ 90sec left in turn
const FIRST_HINT_TIME_SHORT_WORD = 45000;
const FIRST_HINT_TIME_LONG_WORD = 60000;
const SECOND_HINT_TIME_LONG_WORD = 30000;
const THIRD_HINT_TIME_LONG_WORD = 15000;
const SHORT_WORD_LENGTH = 4;
const MAXIMUM_POINTS = 100;
const DRAWER_SCORING = {
  // factor is based on the difficulty of the word, the higher than better
  EASY: 0.8,
  MEDIUM: 0.9,
  HARD: 1,
};

let lines = []; // Array of lines drawn on Canvas
let hint = ""; // Hint for guessers to see
let game = INITIAL_GAME; // Stores gameState, timer, and round
let word = INITIAL_WORD; // Word choices and picked
let drawer = null; // store client id of current drawer
let guessedCorrectOrder = 1; // tracks the order the guesser guessed correctly, starts from 1 and goes up to number of users - 1
let MAX_DIFF_CLOSE_GUESS = 2; // characters difference to consider a close guess

const clients = {}; // Object to map client ids to their usernames

// Listen for client connections
server.listen(PORT, () => console.log(`Listening on ${PORT}`));

/** Clear the lines and send back to clients */
const clearLines = () => {
  lines = []; // clears canvas lines
  io.sockets.emit("all lines", lines);
};

const processMessage = (clientId, message) => {
  // messages.push(message);
  const { type } = message;
  if (type === MESSAGE_TYPE.CLOSE_GUESS) {
    // push message to particular user
    io.to(clientId).emit("all messages", message);
  } else {
    // push message to all users
    io.sockets.emit("all messages", message);
  }
};

/**
 * Finds user's id with drawn === false and lowest joinedTimeStamp
 * @returns id of user with drawn === false and lowest joinedTimeStamp
 */
const findDrawerClientId = () => {
  return usersToNotDrawnUsersArray().sort((a, b) => b.date - a.date)[0].id;
};

/**
 * Filters clients Object for users who have not drawn
 * @returns Array of users who have drawn === false
 */
const usersToNotDrawnUsersArray = () =>
  Object.values(clients).filter((user) => user.drawn === false);

/**
 * Countdown within game.timer in server and game.timer in Redux
 */
const countdown = () => {
  game.timer -= 1000;
  io.sockets.emit("countdown timer");
};
// global so clearInterval knows id to clear;
let intervalGameOver;
let intervalTurnEnd;
let intervalTurnDuring;
let intervalTurnStart;

/**
 * Reset all intervals.
 */
const clearAllTimerIntervals = () => {
  clearInterval(intervalGameOver);
  clearInterval(intervalTurnEnd);
  clearInterval(intervalTurnDuring);
  clearInterval(intervalTurnStart);
};

const clearWord = () => {
  word = INITIAL_WORD;
  io.sockets.emit("choose word", word.choices);
  io.sockets.emit("auto choose word", word.picked);
};

const countdownGameOver = () => {
  countdown();
  if (game.timer <= 0 && game.gameState === GAME_STATE.GAME_OVER) {
    // TODO: Update final scores for the Round.
    prepareRoundStart();
  }
};

const countdownTurnEnd = () => {
  countdown();
  if (game.timer <= 0 && game.gameState === GAME_STATE.TURN_END) {
    clearAllTimerIntervals();
    if (usersToNotDrawnUsersArray().length === 0) {
      // game over
      game.gameState = GAME_STATE.GAME_OVER;
      io.sockets.emit("game over", clients); // send users with updated score
      game.timer = DURATION.GAME_OVER;
      intervalGameOver = setInterval(countdownGameOver, 1000);
    } else {
      // next turn
      game.gameState = GAME_STATE.TURN_START;
      game.timer = DURATION.TURN_START;
      io.sockets.emit("turn start");
      prepareTurnStart();
    }
  }
};

const countdownTurnDuring = () => {
  countdown();
  sendHint();
  if (game.timer <= 0 && game.gameState === GAME_STATE.TURN_DURING) {
    game.gameState = GAME_STATE.TURN_END;
    incrementScoring(); // Increment scores for all users and then send the updated scores
    io.sockets.emit("turn end", clients, word.picked);
    game.timer = DURATION.TURN_END;
    intervalTurnEnd = setInterval(countdownTurnEnd, 1000);
  }
};

const countdownTurnStart = () => {
  countdown();
  if (game.timer <= 0 && game.gameState === GAME_STATE.TURN_START) {
    game.gameState = GAME_STATE.TURN_DURING;
    game.timer = DURATION.TURN_DURING;
    io.sockets.emit("turn during");
    io.to(drawer).emit("auto choose word", word.picked); // syncs state with drawer
    sendHint(); // sends initial blank hint after word is picked before turn during begins
    clearAllTimerIntervals();
    countdownTurnDuring();
    intervalTurnDuring = setInterval(countdownTurnDuring, 1000);
  }
};

// reveal 0 letters @ 0 seconds (start of turn) = all '_'
// reveal only 1 letter for words of length 4 or less @ 45 seconds
// reveal 3 letters for words of length 5 or more @ 60 seconds, 30 seconds & 15 seconds
const sendHint = () => {
  switch (game.timer) {
    case BLANK_HINT_TIME:
      hint = "_".repeat(word.picked.length);
      io.sockets.emit("hint", hint);
      break;
    case FIRST_HINT_TIME_SHORT_WORD:
      if (word.picked.length <= SHORT_WORD_LENGTH) {
        io.sockets.emit("hint", generateHint());
      }
      break;
    case FIRST_HINT_TIME_LONG_WORD:
    case SECOND_HINT_TIME_LONG_WORD:
    case THIRD_HINT_TIME_LONG_WORD:
      if (word.picked.length > SHORT_WORD_LENGTH) {
        io.sockets.emit("hint", generateHint());
      }
      break;
    default:
      // No hint sent
      return;
  }
};

/**
 * generates hint string, and sets it the hint in server.js
 * @returns {string} hint string
 */
const generateHint = () => {
  let letterIdx = Math.floor(Math.random() * word.picked.length);
  while (hint[letterIdx] !== "_") {
    // make sure non-repeating hints are given
    letterIdx = [Math.floor(Math.random() * word.picked.length)];
  }
  let newHint = hint.slice(); // create a copy of the existing hint
  hint =
    newHint.substring(0, letterIdx) +
    word.picked[letterIdx] +
    newHint.substring(letterIdx + 1, word.picked.length);
  return hint;
};

const wordDifficultyFactor = () => {
  // checks if at least one person guessed correctly
  if (guessedCorrectOrder > 1) {
    if (word.picked === word.choices.easy) {
      return DRAWER_SCORING.EASY;
    } else if (word.picked === word.choices.medium) {
      return DRAWER_SCORING.MEDIUM;
    } else if (word.picked === word.choices.hard) {
      return DRAWER_SCORING.HARD;
    } else {
      // Likely when word.choices or word.picked is null or undefined
      console.log("word.picked is not the easy, medium, or hard word.choices.");
      return 0;
    }
  } else {
    return 0; // no one guessed the word correctly;
  }
};

const calculateDrawerFactor = (user) =>
  timeFactor(user.scoring.timer) * wordDifficultyFactor();

// e^(-x/32) is exponential decay to ensure it starts from 100 and is never <= 0
// 1: .969
// 2: .939
// 3: .911
// 4: .882
// 5: .855
// 10: .732
const guesserOrderFactor = (order) => Math.exp(order / -32);

// (1 - 1 / e ^(timer))
// Maximum when timer = 90 is 1
// Minimum when timer = 0 is 0
const timeFactor = (timer) => 1 - 1 / Math.exp(timer);

const calculateGuesserFactor = (user) =>
  guesserOrderFactor(user.scoring.order) * timeFactor(user.scoring.timer);

const scorePoints = (user) => {
  let points = MAXIMUM_POINTS;
  if (user.role === ROLE.DRAWER) {
    points *= calculateDrawerFactor(user);
  } else if (user.role === ROLE.GUESSER) {
    points *= calculateGuesserFactor(user);
  } else {
    // Likely when user.role is null or undefined
    console.log("User is neither a drawer or a guesser");
    points *= 0;
  }
  return Math.ceil(points); // round points since it's a decimal number
};

/** Helper to update scores after a turn ended for those users who wonTurn */
const incrementScoring = () => {
  Object.keys(clients).forEach((key) => {
    if (clients[key].scoring.order > 0) {
      // player guessed correctly or drawer had someone guess their word
      clients[key].scoring.earned = scorePoints(clients[key]); // track how many points user earned for turn
      clients[key].scoring.score += scorePoints(clients[key]); // accumulate player points for the turn
    }
    // clients[key].wonTurn = false; // Clear wonTurn for all players
    clients[key].role = ROLE.GUESSER; // Set all players to guesser
  });
};

/** Helper to clear players score called at the beginning of a Round */
const resetPlayers = () => {
  Object.keys(clients).forEach((key) => {
    clients[key].drawn = false;
    clients[key].scoring = INITIAL_SCORING;
  });
};

const resetScoringForTurn = () => {
  Object.keys(clients).forEach((key) => {
    clients[key].scoring = {
      ...clients[key].scoring,
      earned: 0,
      order: 0,
      timer: 0,
    };
  });
  guessedCorrectOrder = 1;
};

/**
 * Called at the beginning of each round
 * Clear all timers
 * Clear the canvas
 * Pick new drawer
 */
const prepareTurnStart = () => {
  clearAllTimerIntervals();
  clearLines(); // clear the lines
  clearWord(); // clear picked word and choices
  resetScoringForTurn();
  const drawerId = findDrawerClientId(); // computer an id for drawer
  drawer = drawerId; // save reference current client id  of drawer
  clients[drawerId].drawn = true;
  clients[drawerId].role = ROLE.DRAWER;
  io.sockets.emit("all users", clients); // users with updated (turn end) or cleared (RoundStart) score
  intervalTurnStart = setInterval(countdownTurnStart, 1000);
};

/**
 * Called at the beginning of each turn
 * Reset player's drawn and scoring
 * Starts countdown for TURN_START
 * Calls prepareTurnStart
 */
const prepareRoundStart = () => {
  resetPlayers(); // clear scores
  game.gameState = GAME_STATE.TURN_START;
  game.timer = DURATION.TURN_START;
  io.sockets.emit("turn start");
  prepareTurnStart();
};

/**
 * Validate message text against word to guess.
 */
const validateMessageText = (clientId, msgText) => {
  const username = clients[clientId].username;
  const type = findMessageType(clientId, msgText);
  const text = updateMessageText(username, msgText, type);
  return { username: username, text: text, type: type };
};

/**
 * Validate message received against wordToGuess and adjust scoring of order and timer.
 * @returns Message type
 */
const findMessageType = (clientId, msgText) => {
  const wordsRelativeDifference = guessRelativeDifference(msgText);
  if (wordsRelativeDifference === 0) {
    // Record player's order for guessed correctly and the timer
    clients[drawer].scoring.order = guessedCorrectOrder; // so drawer can earn points
    clients[drawer].scoring.timer = Math.max(
      // set timer for drawer.scoring
      clients[drawer].scoring.timer,
      game.timer
    );
    // checks that player hasn't guessed correctly already
    if (clients[clientId].scoring.order === 0) {
      clients[clientId].scoring.order = guessedCorrectOrder++;
      clients[clientId].scoring.timer = game.timer;
    }
    io.sockets.emit("all users", clients); // all players can see that a player guessed the word correctly
    return MESSAGE_TYPE.CORRECT;
  }
  if (wordsRelativeDifference <= MAX_DIFF_CLOSE_GUESS) {
    return MESSAGE_TYPE.CLOSE_GUESS;
  }
  return MESSAGE_TYPE.REGULAR; // regular message
};

/** Helper to update custom message text*/
const updateMessageText = (username, msgText, type) => {
  switch (type) {
    case MESSAGE_TYPE.CORRECT:
      return `${username} guessed the word!`;
    case MESSAGE_TYPE.CLOSE_GUESS:
      return `${username} close guess!`;
    default:
      // All other cases
      return msgText;
  }
};

/**
 * Helper to compare characters difference against word to guess.
 */
const guessRelativeDifference = (msgText) => {
  const guessSize = msgText.length;
  const answerSize = word.picked.length;

  let i = 0;
  let differenceCount = 0;
  while (i < guessSize && i < answerSize) {
    if (msgText.charAt(i).toLowerCase() !== word.picked.charAt(i)) {
      differenceCount++;
    }
    i++;
  }
  return differenceCount + (answerSize - i);
};

/** Helper to validate username already exists in clients */
const validUsername = (newUserName) => {
  for (const key in clients) {
    if (clients[key].username === newUserName) return false;
  }
  return true;
};

/** Add new user to clients collection */
const addClient = (clientId, username, avatar, date) => {
  clients[clientId] = {
    id: clientId,
    username,
    avatar,
    scoring: INITIAL_SCORING,
    role: ROLE.GUESSER,
    onboarded: false,
    joinedTimeStamp: date,
    drawn: false,
    login: LOGIN.VALID,
  };
};

io.on("connection", (client) => {
  client.on("disconnect", () => {
    if (clients.hasOwnProperty(client.id)) {
      processMessage(client.id, {
        username: clients[client.id].username,
        text: `${clients[client.id].username} has left the chat`,
        type: MESSAGE_TYPE.LEAVE,
      });
      delete clients[client.id];
      if (Object.keys(clients).length <= 1) {
        client.emit("wait for another player", clients[client.id]);
        io.sockets.emit("game waiting");
        game.gameState = GAME_STATE.GAME_WAITING;
        game.timer = DURATION.GAME_WAITING;
        clearAllTimerIntervals();
      }
      io.sockets.emit("all users", clients);
    }
  });

  client.on("join", (username, avatar, date) => {
    if (validUsername(username)) {
      // Add new user to clients in server
      addClient(client.id, username, avatar, date);
      client.emit("add player", clients[client.id]); // trigger adding of player in redux
      processMessage(client.id, {
        username,
        text: `${username} has joined the chat!`,
        type: MESSAGE_TYPE.JOIN,
      }); // use processMessage to send all messages
      io.sockets.emit("all users", clients);
      client.emit("all lines", lines);
      client.emit("update game", game);
      // prepare to start game when exactly 2 players join
      if (Object.keys(clients).length === 2) {
        prepareRoundStart();
      }
    } else {
      client.emit("invalid username");
    }
  });

  client.on("new message", (msgText) => {
    const message = validateMessageText(client.id, msgText);
    processMessage(client.id, message);
  });

  client.on("new line", (line) => {
    lines.push(line);
    io.sockets.emit("all lines", lines);
  });

  client.on("new word", (picked) => {
    word.picked = picked;
    game.timer = 0; // Moves game from TURN_START to end of TURN_START
  });

  client.on("get words to choose from", () => {
    word.choices = getWordChoicesData();
    word.picked = word.choices.easy; // default is the easy word unless changed
    client.emit("choose word", word.choices);
  });
});
