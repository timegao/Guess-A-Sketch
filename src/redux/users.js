import { UPDATE_USERS } from "./actionConstants";
import { INITIAL_USERS } from "./stateConstants";

const usersReducer = (state = INITIAL_USERS, action) => {
  switch (action.type) {
    case UPDATE_USERS: {
      return action.payload;
    }
    default:
      return state;
  }
};

export default usersReducer;

export const getUsers = (state) => state.users;
