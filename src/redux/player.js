import { ADD_PLAYER } from "./actionConstants";
import { INITIAL_PLAYER } from "./stateConstans";

const playerReducer = (state = INITIAL_PLAYER, action) => {
  switch (action.type) {
    case ADD_PLAYER: {
      return action.payload;
    }
    default:
      return state;
  }
};

export default playerReducer;

export const getPlayer = (state) => state.player;
