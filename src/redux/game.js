import {
  COUNTDOWN_TIMER,
  SET_GAME_OVER,
  SET_GAME_WAITING,
  SET_ROUND_DURING,
  SET_ROUND_END,
  SET_ROUND_START,
} from "./actionConstants";
import { GAME_STATE, INITIAL_GAME } from "./stateConstants";

const gameReducer = (state = INITIAL_GAME, action) => {
  switch (action.type) {
    case SET_GAME_WAITING:
      return INITIAL_GAME;
    case SET_ROUND_START:
      return {
        ...state,
        gameState: GAME_STATE.ROUND_START,
        timer: 15000,
      };
    case SET_ROUND_DURING:
      return {
        ...state,
        gameState: GAME_STATE.ROUND_DURING,
        timer: 90000,
      };
    case SET_ROUND_END:
      return {
        ...state,
        gameState: GAME_STATE.ROUND_END,
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
