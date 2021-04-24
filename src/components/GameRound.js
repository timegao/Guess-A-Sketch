import { useSelector } from "react-redux";
import { getGameRound } from "../redux/game";

const GameRound = () => {
  const round = useSelector(getGameRound);

  return <div>Round: {round}</div>;
};

export default GameRound;
