import { ADD_PLAYER, INVALID_USERNAME } from "./actionConstants";
import { INITIAL_PLAYER, LOGIN } from "./stateConstants";

const playerReducer = (state = INITIAL_PLAYER, action) => {
  switch (action.type) {
    case ADD_PLAYER:
      return { player: action.payload, login: LOGIN.VALID };
    case INVALID_USERNAME:
      return { ...state, login: LOGIN.INVALID };
    default:
      return state;
  }
};

export default playerReducer;

export const getPlayer = (state) => state.player.player;

export const getLogin = (state) => state.player.login;
