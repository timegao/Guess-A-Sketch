import { INITIAL_MESSAGES } from "./stateConstants";
import { UPDATE_MESSAGES, LOGOUT } from "./actionConstants";

const messagesReducer = (state = INITIAL_MESSAGES, action) => {
  switch (action.type) {
    case UPDATE_MESSAGES:
      return [...state, action.payload.message];
    case LOGOUT:
      return [...INITIAL_MESSAGES];
    default:
      return state;
  }
};

export const getMessages = (state) => state.messages;

export default messagesReducer;
