import { useState } from "react";
import { useSelector } from "react-redux";
import PlayerList from "../components/PlayerList";

import MessageForm from "../components/MessageForm";
import Messages from "../components/Messages";
import Canvas from "../components/Canvas";
import JoinChat from "../components/JoinChat";
import { getPlayer } from "../redux/player";
import CanvasInputs from "../components/CanvasInputs";
import { INITIAL_STROKE } from "../redux/stateConstants";

const App = () => {
  const player = useSelector(getPlayer);
  // Point state. Point represents an x and y coordinate
  const [point, setPoint] = useState({
    x: 0,
    y: 0,
  });

  // Stroke state. Stroke represents lineWidth and color
  const [stroke, setStroke] = useState(INITIAL_STROKE);

  return (
    <>
      {player.hasOwnProperty("username") ? (
        <>
          <div class="row w-100">
            <div class="col-10">
              <Canvas
                stroke={stroke}
                setStroke={setStroke}
                point={point}
                setPoint={setPoint}
              />
            </div>
            <div class="col">
              <CanvasInputs
                stroke={stroke}
                setStroke={setStroke}
                point={point}
                setPoint={setPoint}
              />
              <Messages />
              <MessageForm />
            </div>
          </div>
        </>
      ) : (
        <JoinChat />
      )}
    </>
  );
};

export default App;
