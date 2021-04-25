import { UPDATE_WORD_CHOICES, UPDATE_WORD_PICKED } from "./actionConstants";
import { INITIAL_WORD } from "./stateConstants";

const wordReducer = (state = INITIAL_WORD, action) => {
  switch (action.type) {
    case UPDATE_WORD_CHOICES:
      return {
        ...state,
        choices: action.payload.choices,
      };
    case UPDATE_WORD_PICKED:
      return {
        ...state,
        picked: action.payload.picked,
      };
    default:
      return state;
  }
};

export default wordReducer;

export const getWord = (state) => state.word;

export const getPickedWord = (state) => state.word.picked;
