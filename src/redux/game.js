import {
  COUNTDOWN_TIMER,
  SET_GAME_OVER,
  SET_GAME_WAITING,
  SET_TURN_DURING,
  SET_TURN_END,
  SET_TURN_START,
  UPDATE_GAME,
  SET_HINT,
} from "./actionConstants";
import { DURATION, GAME_STATE, INITIAL_GAME } from "./stateConstants";

const gameReducer = (state = INITIAL_GAME, action) => {
  switch (action.type) {
    case SET_GAME_WAITING:
      return INITIAL_GAME;
    case SET_TURN_START:
      return {
        ...state,
        gameState: GAME_STATE.TURN_START,
        timer: DURATION.TURN_START,
      };
    case SET_TURN_DURING:
      return {
        ...state,
        gameState: GAME_STATE.TURN_DURING,
        timer: DURATION.TURN_DURING,
      };
    case SET_TURN_END:
      return {
        ...state,
        gameState: GAME_STATE.TURN_END,
        timer: DURATION.TURN_END,
        wordToGuess: "",
        wordChoices: {},
      };
    case SET_GAME_OVER:
      return {
        ...state,
        gameState: GAME_STATE.GAME_OVER,
        timer: DURATION.GAME_OVER,
      };
    case COUNTDOWN_TIMER:
      return {
        ...state,
        timer: state.timer - 1000,
      };
    case SET_HINT:
      return {
        ...state,
        hint: action.payload.hint,
      };
    case UPDATE_GAME:
      return action.payload.game;
    default:
      return state;
  }
};

export const getGame = (state) => state.game;

export const getGameState = (state) => state.game.gameState;

export const getGameClock = (state) => state.game.timer;

export const getGameRound = (state) => state.game.round;

export const getHint = (state) => state.game.hint;

export default gameReducer;
