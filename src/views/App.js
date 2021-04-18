import { useState } from "react";
import { useSelector } from "react-redux";
import JoinChat from "../components/JoinChat";
import { getPlayer } from "../redux/player";
import GameView from "../components/GameView";
import CanvasInputs from "../components/CanvasInputs";
import { INITIAL_STROKE } from "../redux/stateConstants";

const App = () => {
  const player = useSelector(getPlayer);
  // // Point state. Point represents an x and y coordinate
  // const [point, setPoint] = useState({
  //   x: 0,
  //   y: 0,
  // });

  // // Stroke state. Stroke represents lineWidth and color
  // const [stroke, setStroke] = useState(INITIAL_STROKE);

  return <>{player.hasOwnProperty("username") ? <GameView /> : <JoinChat />}</>;
};

export default App;
