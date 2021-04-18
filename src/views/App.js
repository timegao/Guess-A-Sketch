import { useState } from "react";
import { useSelector } from "react-redux";
import JoinChat from "../components/JoinChat";
import { getPlayer } from "../redux/player";
import GameView from "../components/GameView";
import CanvasInputs from "../components/CanvasInputs";
import { INITIAL_STROKE } from "../redux/stateConstants";

const App = () => {
  const player = useSelector(getPlayer);

  return <>{player.hasOwnProperty("username") ? <GameView /> : <JoinChat />}</>;
};

export default App;
