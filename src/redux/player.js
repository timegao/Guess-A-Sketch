import { ADD_PLAYER, INVALID_USERNAME, LOGOUT } from "./actionConstants";
import { INITIAL_PLAYER, LOGIN } from "./stateConstants";

const playerReducer = (state = INITIAL_PLAYER, action) => {
  switch (action.type) {
    case ADD_PLAYER:
      return action.payload;
    case INVALID_USERNAME:
      return { ...state, login: LOGIN.INVALID };
    case LOGOUT:
      return INITIAL_PLAYER;
    default:
      return state;
  }
};

export default playerReducer;

export const getPlayer = (state) => state.player;

export const getLogin = (state) => state.player.login;
