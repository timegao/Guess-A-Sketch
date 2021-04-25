import { ADD_PLAYER, INVALID_USERNAME } from "./actionConstants";
import { INITIAL_PLAYER, LOGIN } from "./stateConstants";

const playerReducer = (state = INITIAL_PLAYER, action) => {
  switch (action.type) {
    case ADD_PLAYER:
      return action.payload;
    case INVALID_USERNAME:
      return { ...state, login: LOGIN.INVALID };
    default:
      return state;
  }
};

export default playerReducer;

export const getPlayer = (state) => state.player;

export const getLogin = (state) => state.player.login;
