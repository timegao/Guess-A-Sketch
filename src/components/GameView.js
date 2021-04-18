import { useState } from "react";
import { useDispatch } from "react-redux";
import { newMessage } from "../redux/actions";
import Canvas from "./Canvas";
import Chat from "./Chat";

const GameView = () => {
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(newMessage(message));
    setMessage("");
  };

  const onKeyUp = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div class="card">
      <div class="card-header text-center">
        TODO: Header Component Goes Here
      </div>
      <div class="card-body p-0">
        <div className="row">
          <div className="col-sm col-md-2 text-center p-0">
            PlayerList goes here...
          </div>
          <div className="col-sm col-md-8 text-center p-0">
            {/* <Canvas /> */}
            Canvas goes here
          </div>
          <div className="col-sm col-md-2 p-0">
            <Chat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameView;
