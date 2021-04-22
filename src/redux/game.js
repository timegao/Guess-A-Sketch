import {
  COUNTDOWN_TIMER,
  SET_GAME_OVER,
  SET_GAME_WAITING,
  SET_TURN_DURING,
  SET_TURN_END,
  SET_TURN_START,
  UPDATE_GAME,
  SET_WORD_CHOICES,
  SET_WORD_TO_GUESS,
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
    case SET_WORD_CHOICES:
      return {
        ...state,
        wordChoices: action.payload.wordChoices,
      };
    case SET_WORD_TO_GUESS:
      return {
        ...state,
        wordToGuess: action.payload.wordToGuess,
      };
    case UPDATE_GAME:
      return action.payload.game;
    default:
      return state;
  }
};

export const getGame = (state) => state.game;

export const getGameState = (state) => state.game.gameState;

export const getWords = (state) => state.game.wordChoices;

export default gameReducer;
