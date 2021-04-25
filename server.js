/** SERVER CONFIGURATION */
const express = require("express");
const { getWordChoicesData } = require("./src/data/words");
const {
  INITIAL_GAME,
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

const BLANK_HINT_TIME = 0;
const FIRST_HINT_TIME_SHORT_WORD = 45000;
const FIRST_HINT_TIME_LONG_WORD = 60000;
const SECOND_HINT_TIME_LONG_WORD = 30000;
const THIRD_HINT_TIME_LONG_WORD = 15000;
const SHORT_WORD_LENGTH = 4;

let lines = []; // Array of lines drawn on Canvas
// let wordToGuess = "correct"; // Word for users to guess
let hint = ""; // Hint for guessers to see
let game = INITIAL_GAME; // Stores gameState, timer, and round
let word = INITIAL_WORD; // Word choices and picked
let drawer = null; // store client id of current drawer
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
      io.sockets.emit("game over");
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
    io.sockets.emit("turn end");
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
  console.log(hint);
  return hint;
};

/**
 * Called at the beginning of each round
 * Clear all timers
 * Clear the canvas
 * Update player scores, wonTurn
 * Pick new drawer
 */
const prepareTurnStart = () => {
  clearAllTimerIntervals();
  clearLines(); // clear the lines
  clearWord(); // clear picked word and choices
  Object.keys(clients).forEach((key) => {
    if (clients[key].wonTurn) {
      clients[key].score++; // Add 1 to score for players who guessed word in the turn
    }
    clients[key].wonTurn = false; // Clear wonTurn for all players
    clients[key].role = ROLE.GUESSER; // Set all players to guesser
  });
  const drawerId = findDrawerClientId(); // computer an id for drawer
  drawer = drawerId; // save reference current client id  of drawer
  clients[drawerId].drawn = true;
  clients[drawerId].role = ROLE.DRAWER;
  io.sockets.emit("all users", clients);
  intervalTurnStart = setInterval(countdownTurnStart, 1000);
};

/**
 * Called at the beginning of each turn
 * Reset player's drawn and wonTurn
 * Starts countdown for TURN_START
 * Calls prepareTurnStart
 */
const prepareRoundStart = () => {
  Object.keys(clients).forEach((key) => {
    clients[key].drawn = false;
    clients[key].wonTurn = false; //  Needs to be false so prepareTurnStart won't add points after a round is over (game over).
    clients[key].score = 0;
  });
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
 * Validate message received against wordToGuess and adjust wonTurn.
 * @returns Message type
 */
const findMessageType = (clientId, msgText) => {
  const wordsRelativeDifference = guessRelativeDifference(msgText);
  if (wordsRelativeDifference === 0) {
    clients[clientId].wonTurn = true;
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
    score: 0,
    role: ROLE.GUESSER,
    onboarded: false,
    joinedTimeStamp: date,
    drawn: false,
    wonTurn: false,
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
    sendHint(); // sends initial blank hint after word is picked before turn during begins
  });

  client.on("get words to choose from", () => {
    word.choices = getWordChoicesData();
    word.picked = word.choices.easy; // default is the easy word unless changed
    client.emit("choose word", word.choices);
  });
});
