import { SET_CANVAS_DIMENSIONS } from "./actionConstants";
import { INITIAL_DRAWER } from "./stateConstants";

const drawerReducer = (state = INITIAL_DRAWER, action) => {
  switch (action.type) {
    case SET_CANVAS_DIMENSIONS:
      return action.payload;
    default:
      return state;
  }
};

export const getDrawer = (state) => state.drawer;

export const getCanvasHeight = (state) => state.drawer.canvasHeight;
export const getCanvasWidth = (state) => state.drawer.canvasWidth;

export default drawerReducer;
