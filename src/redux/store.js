import { createStore, applyMiddleware, combineReducers } from "redux";

import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import messagesReducer from "./messages";
import linesReducer from "./lines";
import usersReducer from "./users";
import playerReducer from "./player";

const rootReducer = combineReducers({
  lines: linesReducer,
  messages: messagesReducer,
  player: playerReducer,
  users: usersReducer,
});

// Adds middleware and redux-devtools
export default createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunkMiddleware))
);
