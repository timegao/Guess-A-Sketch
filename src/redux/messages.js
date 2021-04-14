import { INITIAL_MESSAGES } from "./stateConstans";
import { UPDATE_MESSAGES } from "./actionConstants";

const messagesReducer = (state = INITIAL_MESSAGES, action) => {
  switch (action.type) {
    case UPDATE_MESSAGES:
      return action.payload.messages;
    default:
      return state;
  }
};

export const getMessages = (state) => state.messages;

export default messagesReducer;
