import { ADD_PLAYER } from "./actionConstants";
import { INITIAL_USERS } from "./stateConstans";

const usersReducer = (state = INITIAL_USERS, action) => {
  switch (action.type) {
    case ADD_PLAYER: {
      return { ...state, [action.payload.username]: action.payload };
    }
    default:
      return state;
  }
};

export default usersReducer;

export const getUsers = (state) => state.users;
