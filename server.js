/** SERVER CONFIGURATION */
const { count } = require("console");
const express = require("express");
const {
  INITIAL_GAME,
  MESSAGE_TYPE,
  ROLE,
  DURATION,
  GAME_STATE,
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

let lines = []; // Array of lines drawn on Canvas
let wordToGuess = "correct"; // Word for users to guess
let hint = ""; // Hint for guessers to see
let game = INITIAL_GAME; // Stores gameState, timer, and round
let MAX_DIFF_CLOSE_GUESS = 2; // characters difference to consider a close guess

const clients = {}; // Object to map client ids to their usernames

// Listen for client connections
server.listen(PORT, () => console.log(`Listening on ${PORT}`));

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

const countdownGameOver = () => {
  countdown();
  if (game.timer <= 0 && game.gameState === GAME_STATE.GAME_OVER) {
    game.gameState = GAME_STATE.TURN_START;
    io.sockets.emit("turn start");
    game.timer = DURATION.TURN_START;
    clearInterval(intervalGameOver);
    intervalTurnStart = setInterval(countdownTurnStart, 1000);
  }
};

const countdownTurnEnd = () => {
  countdown();
  if (game.timer <= 0 && game.gameState === GAME_STATE.TURN_END) {
    game.gameState = GAME_STATE.GAME_OVER;
    io.sockets.emit("game over");
    game.timer = DURATION.GAME_OVER;
    clearInterval(intervalTurnEnd);
    intervalGameOver = setInterval(countdownGameOver, 1000);
  }
};

const countdownTurnDuring = () => {
  countdown();
  io.sockets.emit("hello", "countdown turnduring");
  if (game.timer <= 0 && game.gameState === GAME_STATE.TURN_DURING) {
    game.gameState = GAME_STATE.TURN_END;
    io.sockets.emit("turn end");
    game.timer = DURATION.TURN_END;
    clearInterval(intervalTurnDuring);
    intervalTurnEnd = setInterval(countdownTurnEnd, 1000);
  }
};

const countdownTurnStart = () => {
  countdown();
  io.sockets.emit("hello", "countdown turnstart");
  if (game.timer <= 0 && game.gameState === GAME_STATE.TURN_START) {
    game.gameState = GAME_STATE.TURN_DURING;
    game.timer = DURATION.TURN_DURING;
    io.sockets.emit("turn during");
    clearInterval(intervalTurnStart);
    intervalTurnDuring = setInterval(countdownTurnDuring, 1000);
  }
};

/**
 * prepareTurnStart is called by prepareRoundStart at the beginning of the game
 */
const prepareTurnStart = () => {
  lines = []; // clears canvas lines
  Object.keys(clients).forEach((key) => {
    if (clients[key].wonRound) {
      clients[key].score++; // Add 1 to score for players who won
    }
    clients[key].wonRound = false; // Clear wonRound for all players
    clients[key].role = ROLE.GUESSER; // Set all players to guesser
  });
  const drawerId = findDrawerClientId(); // computer an id for drawer
  clients[drawerId].drawn = true;
  clients[drawerId].role = ROLE.DRAWER;
  io.to(drawerId).emit("add player", clients[drawerId]);
  intervalTurnStart = setInterval(countdownTurnStart, 1000);
};

/**
 * 1. Add one to score for players with wonTurn = true
 * 2. Set wonTurn for all players to false
 * 3-4. Pick player with lowest joinedTimeStamp and drawn = false and set their drawn to true and set their role to ROLES.DRAWER
 * 5. Clear canvas/lines
 * 6. Set GameState to TURN_START
 * 7. Start countdown
 */
const prepareRoundStart = () => {
  Object.keys(clients).forEach((key) => {
    clients[key].drawn = false;
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
  const type = findMessageType(msgText);
  const text = updateMessageText(username, msgText, type);
  return { username: username, text: text, type: type };
};

/**
 * Helper to find message type
 */
const findMessageType = (msgText) => {
  const wordsRelativeDifference = guessRelativeDifference(msgText);
  if (wordsRelativeDifference === 0) {
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
  const answerSize = wordToGuess.length;

  let i = 0;
  let differenceCount = 0;
  while (i < guessSize && i < answerSize) {
    if (msgText.charAt(i).toLowerCase() !== wordToGuess.charAt(i)) {
      differenceCount++;
    }
    i++;
  }
  return differenceCount + (answerSize - i);
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
      }
      io.sockets.emit("all users", clients);
    }
  });

  client.on("join", (username, date) => {
    // Add new user to clients in server
    clients[client.id] = {
      id: client.id,
      username,
      score: 0,
      role: ROLE.GUESSER,
      onboarded: false,
      joinedTimeStamp: date,
      drawn: false,
      wonTurn: false,
    };
    client.emit("add player", clients[client.id]); // trigger adding of player in redux
    processMessage(client.id, {
      username,
      text: `${username} has joined the chat!`,
      type: MESSAGE_TYPE.JOIN,
    }); // use processMessage to send all messages
    io.sockets.emit("all users", clients);
    io.sockets.emit("all lines", lines);
    io.sockets.emit("update game", game);
    // prepare to start game when exactly 2 players join
    if (Object.keys(clients).length === 2) {
      prepareRoundStart();
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
});
