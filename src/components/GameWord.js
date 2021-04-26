import { useSelector } from "react-redux";
import { getHint } from "../redux/game";
import { getPlayer } from "../redux/player";
import { ROLE } from "../redux/stateConstants";
import { getUsers } from "../redux/users";
import { getWord } from "../redux/word";

// TO DO: if we later keep drawer reference in store, this could be replaced with simple to check
// that current user is not the drawer.
const isGuesserPlayer = (player, users) => {
  return users[player.username].role === ROLE.GUESSER;
};

const GameWord = () => {
  const player = useSelector(getPlayer);
  const users = useSelector(getUsers);
  const { picked } = useSelector(getWord);
  const hint = useSelector(getHint);
  return (
    <>
      {isGuesserPlayer(player, users) ? (
        <div className="gameWord-hint">
          <p className="fs-3">{hint}</p>
        </div>
      ) : (
        <div>
          <p className="mt-3">Draw: </p>
          <p className="fs-3 gameWord-answer">
            <strong>{picked}</strong>
          </p>
        </div>
      )}
    </>
  );
};

export default GameWord;
