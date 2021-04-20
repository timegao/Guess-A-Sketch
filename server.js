/** SERVER CONFIGURATION */
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

let messages = []; // Array of messages sent to users
let lines = []; // Array of lines drawn on Canvas
let word = ""; // Word for users to guess
let hint = ""; // Hint for guessers to see
let game = INITIAL_GAME; // Stores gameState, timer, and round

const clients = {}; // Object to map client ids to their usernames

// Listen for client connections
server.listen(PORT, () => console.log(`Listening on ${PORT}`));

const processMessage = (message) => {
  messages.push(message);
  io.sockets.emit("all messages", messages);
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

const countdownTurnEnd = () => {
  if (game.gameState === GAME_STATE.TURN_END) {
    if (game.timer > 0) {
      io.sockets.emit("countdown timer");
      game.timer -= 1000;
      setTimeout(countdownTurnEnd, 1000);
    } else {
      game.gameState = GAME_STATE.GAME_OVER;
      io.sockets.emit("game over");
      game.timer = DURATION.GAME_OVER;
    }
  }
};

const countdownTurnDuring = () => {
  if (game.gameState === GAME_STATE.TURN_DURING) {
    if (game.timer > 0) {
      io.sockets.emit("countdown timer");
      game.timer -= 1000;
      setTimeout(countdownTurnDuring, 1000);
    } else {
      game.gameState = GAME_STATE.TURN_END;
      game.timer = DURATION.TURN_END;
      io.sockets.emit("turn end");
      countdownTurnEnd();
    }
  }
};

const countdownTurnStart = () => {
  if (game.gameState === GAME_STATE.TURN_START) {
    if (game.timer > 0) {
      io.sockets.emit("countdown timer");
      game.timer -= 1000;
      setTimeout(countdownTurnStart, 1000);
    } else {
      game.gameState = GAME_STATE.TURN_DURING;
      game.timer = DURATION.TURN_DURING;
      io.sockets.emit("turn during");
      countdownTurnDuring();
    }
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
  countdownTurnStart();
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

io.on("connection", (client) => {
  client.on("disconnect", () => {
    if (clients.hasOwnProperty(client.id)) {
      processMessage({
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
    messages.push({
      username,
      text: `${username} has joined the chat!`,
      type: MESSAGE_TYPE.JOIN,
    });
    client.emit("add player", clients[client.id]); // trigger adding of player in redux
    io.sockets.emit("all messages", messages); // TODO: users should only receive messages sent after they've joined
    io.sockets.emit("all users", clients);
    // prepare to start game when exactly 2 players join
    if (Object.keys(clients).length === 2) {
      prepareRoundStart();
    }
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
