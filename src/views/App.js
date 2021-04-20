import { useSelector } from "react-redux";
import JoinChat from "../components/JoinChat";
import { getPlayer } from "../redux/player";
import GameView from "../components/GameView";

const App = () => {
  const player = useSelector(getPlayer);

  return <>{player.hasOwnProperty("username") ? <GameView /> : <JoinChat />}</>;
};

export default App;
