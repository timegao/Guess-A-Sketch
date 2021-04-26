import { useSelector } from "react-redux";
import { getGameRound } from "../redux/game";

const GameRound = () => {
  const round = useSelector(getGameRound);

  return (
    <div>
      Round: <span className="fs-2">{round}</span>
    </div>
  );
};

export default GameRound;
