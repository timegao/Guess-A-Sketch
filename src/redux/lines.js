import { INITIAL_LINES } from "./stateConstants";
import { ADD_LINE, CLEAR_LINES } from "./actionConstants";

const linesReducer = (state = INITIAL_LINES, action) => {
  switch (action.type) {
    case ADD_LINE:
      return action.payload.lines;
    case CLEAR_LINES:
      return [];
    default:
      return state;
  }
};

export const getLine = (state) => state.lines;

export default linesReducer;
