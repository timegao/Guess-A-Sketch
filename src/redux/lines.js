import { INITIAL_LINES } from "./stateConstans";
import { ADD_LINE } from "./actionConstants";

const linesReducer = (state = INITIAL_LINES, action) => {
  switch (action.type) {
    case ADD_LINE:
      return action.payload.lines;
    default:
      return state;
  }
};

export const getLine = (state) => state.lines;

export default linesReducer;
