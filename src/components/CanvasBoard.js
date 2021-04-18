import { useState } from "react";
import { useDispatch } from "react-redux";
import { newMessage } from "../redux/actions";
import Canvas from "./Canvas";
import CanvasInputs from "./CanvasInputs";
import { INITIAL_STROKE } from "../redux/stateConstants";

const CanvasBoard = () => {
  const [message, setMessage] = useState("");
  // Point state. Point represents an x and y coordinate
  const [point, setPoint] = useState({
    x: 0,
    y: 0,
  });

  // Stroke state. Stroke represents lineWidth and color
  const [stroke, setStroke] = useState(INITIAL_STROKE);

  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(newMessage(message));
    setMessage("");
  };

  const onKeyUp = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <>
      <CanvasInputs
        stroke={stroke}
        setStroke={setStroke}
        point={point}
        setPoint={setPoint}
      />
      <Canvas
        stroke={stroke}
        setStroke={setStroke}
        point={point}
        setPoint={setPoint}
      />
    </>
  );
};

export default CanvasBoard;
