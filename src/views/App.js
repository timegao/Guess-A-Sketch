import { useSelector } from "react-redux";

import MessageForm from "../components/MessageForm";
import Messages from "../components/Messages";
import Canvas from "../components/Canvas";
import JoinChat from "../components/JoinChat";
import { getPlayer } from "../redux/player";

const App = () => {
  const player = useSelector(getPlayer);

  return (
    <>
      {player.hasOwnProperty("username") ? (
        <>
          <Canvas />
          <Messages />
          <MessageForm />
        </>
      ) : (
        <JoinChat />
      )}
    </>
  );
};

export default App;
