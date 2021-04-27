import { useSelector } from "react-redux";
import JoinChat from "../components/JoinChat";
import { getLogin } from "../redux/player";
import GameView from "../components/GameView";
import { LOGIN } from "../redux/stateConstants";

const App = () => {
  const loginStatus = useSelector(getLogin);

  return <>{loginStatus === LOGIN.LOGGED_IN ? <GameView /> : <JoinChat />}</>;
};

export default App;
