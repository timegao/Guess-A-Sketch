import {
  COUNTDOWN_TIMER,
  SET_GAME_OVER,
  SET_GAME_WAITING,
  SET_TURN_DURING,
  SET_TURN_END,
  SET_TURN_START,
} from "./actionConstants";
import { GAME_STATE, INITIAL_GAME } from "./stateConstants";

const gameReducer = (state = INITIAL_GAME, action) => {
  switch (action.type) {
    case SET_GAME_WAITING:
      return INITIAL_GAME;
    case SET_TURN_START:
      return {
        ...state,
        gameState: GAME_STATE.TURN_START,
        timer: 15000,
      };
    case SET_TURN_DURING:
      return {
        ...state,
        gameState: GAME_STATE.TURN_DURING,
        timer: 90000,
      };
    case SET_TURN_END:
      return {
        ...state,
        gameState: GAME_STATE.TURN_END,
        timer: 5000,
      };
    case SET_GAME_OVER:
      return {
        ...state,
        gameState: GAME_STATE.GAME_OVER,
        timer: 10000,
      };
    case COUNTDOWN_TIMER:
      return {
        ...state,
        timer: state.timer - 1000,
      };
    default:
      return state;
  }
};

export const getGame = (state) => state.game;

export default gameReducer;
