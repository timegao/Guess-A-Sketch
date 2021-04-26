import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AVATAR_MAP } from "../redux/stateConstants";

const PlayerInfo = ({ user }) => {
  return (
    <li className="player">
      <div className="d-inline-flex mx-1">
        <div className="mx-2 mt-3">
          <FontAwesomeIcon icon={AVATAR_MAP[user.avatar]} size="2x" />
        </div>
        <div className="user-data">
          <p>
            <strong>{user.username}</strong>
          </p>
          <p>{"points: " + user.scoring.score} </p>
        </div>
      </div>
    </li>
  );
};

export default PlayerInfo;
