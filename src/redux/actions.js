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
} from "./actionConstants";
import { MESSAGE_TYPE } from "./stateConstants";
import store from "./store";

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
export const updateMessages = (messages) => ({
  type: UPDATE_MESSAGES,
  payload: {
    messages,
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
    // dispatch(addPlayer(username, date));
    joinChat(username, date);
  };
};

export const newMessage = (msg) => {
  let username = store.getState().player.username;
  return (dispatch) => {
    const type = findMessageType(msg);
    // TODO if message type is correct need to update player score.
    // Also need to send message to server to update score -- Immediateley or @ end of round?
    const text = createMessageText(msg, type);
    // TODO dispatch to updatemessages??
    addMessage({ username, text, type });
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

const findMessageType = (msg) => {
  // TODO need game state to hold answer for current drawing
  let correctAnswer = store.getState().answer;
  correctAnswer = "testing";
  // TO DO find relative difference between strings and display to all
  // users if the guess is not slightly misspelled
  if (msg.toLowerCase() === correctAnswer) {
    return MESSAGE_TYPE.CORRECT;
  }
  return MESSAGE_TYPE.REGULAR; // regular message
};

const createMessageText = (msg, type) => {
  const username = store.getState().player.username;
  //TO DO need game state to hold answer for current drawing
  let correctAnswer = store.getState().answer;
  correctAnswer = "testing";
  switch (type) {
    case MESSAGE_TYPE.CORRECT:
      return `${username} guessed the word!`;
    default:
      // All other cases
      return msg;
  }
  // other message cases are emitted by the server not client
};

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
