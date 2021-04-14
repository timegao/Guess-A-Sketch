export const ROLES = {
  DRAWER: "drawer",
  GUESSER: "guesser",
};

export const GAME_STATE = {
  PRE_GAME: "pre game",
  POST_GAME: "post game",
  IN_GAME: "in game",
};

export const INITIAL_MESSAGES = [];

export const INITIAL_LINES = [];

// Represents all players in the game
export const INITIAL_USERS = {};

// Represents the single player playing
export const INITIAL_PLAYER = {};

export const INITIAL_GAME = {
  gameState: GAME_STATE.PRE_GAME,
  timer: 0,
};
