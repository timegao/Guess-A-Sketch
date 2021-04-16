import { joinChat, addMessage, addLine } from "../client";
import { ADD_LINE, UPDATE_MESSAGES, ADD_PLAYER } from "./actionConstants";
import { ROLES } from "./stateConstans";

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

const addPlayer = (username, date) => ({
  type: ADD_PLAYER,
  payload: {
    username,
    score: 0,
    role: ROLES.GUESSER,
    onboarded: false,
    joinedTimeStamp: date,
  },
});

export const newPlayer = (username) => {
  return (dispatch) => {
    const date = new Date();
    dispatch(addPlayer(username, date));
    joinChat(username, date);
  };
};

export const newMessage = (message) => {
  return () => addMessage(message);
};

export const newLine = (line) => {
  return () => addLine(line);
};
