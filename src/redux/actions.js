import { joinChat, addMessage, addLine } from "../client";
import {
  ADD_LINE,
  UPDATE_MESSAGES,
  ADD_PLAYER,
  UPDATE_USERS,
  UPDATE_USER,
  SET_GAME_WAITING,
  SET_TURN_START,
  SET_TURN_DURING,
  SET_TURN_END,
  SET_GAME_OVER,
  COUNTDOWN_TIMER,
  UPDATE_GAME,
} from "./actionConstants";

// Action creator functions - use async actions to communicate with server

/**
 * Template calling client.js example
 *
 * export const actionName = () => {
 *    return dispatch => {
 *      myFunction(result => {
 *          dispatch(...an action that updates the store...)
 *      })
 *    }
 * }
 */
export const updateMessages = (message) => ({
  type: UPDATE_MESSAGES,
  payload: {
    message,
  },
});

export const updateLines = (lines) => ({
  type: ADD_LINE,
  payload: {
    lines,
  },
});

// const addPlayer = (username, date) => ({
//   type: ADD_PLAYER,
//   payload: {
//     username,
//     score: 0,
//     role: ROLES.GUESSER,
//     onboarded: false,
//     joinedTimeStamp: date,
//     wait: true,
//   },
// });

export const addPlayer = (user) => ({
  type: ADD_PLAYER,
  payload: {
    username: user.username,
    id: user.id,
  },
});

export const newPlayer = (username) => {
  return (dispatch) => {
    const date = new Date();
    joinChat(username, date);
  };
};

export const newMessage = (msg) => {
  return (dispatch) => {
    addMessage(msg);
  };
};

export const newLine = (line) => {
  return () => addLine(line);
};

export const updateUsers = (users) => ({
  type: UPDATE_USERS,
  payload: formatUsersData(users),
});

export const updateUser = (user) => ({
  type: UPDATE_USER,
  payload: user,
});

/*---------------------------------*/
/* Helpers */
/*---------------------------------*/

const formatUsersData = (users) => {
  const newUsers = {};
  Object.keys(users).map(
    (userId, i) => (newUsers[users[userId].username] = users[userId])
  );
  return newUsers;
};

export const setGameWaiting = () => ({
  type: SET_GAME_WAITING,
});

export const setTurnStart = () => ({
  type: SET_TURN_START,
});

export const setTurnDuring = () => ({
  type: SET_TURN_DURING,
});

export const setTurnEnd = () => ({
  type: SET_TURN_END,
});

export const setGameOver = () => ({
  type: SET_GAME_OVER,
});

export const countdownTimer = () => ({
  type: COUNTDOWN_TIMER,
});

export const updateGame = (game) => ({
  type: UPDATE_GAME,
  payload: {
    game,
  },
});
