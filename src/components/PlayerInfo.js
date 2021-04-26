import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";
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
        {user.scoring.order > 0 ? (
          <div>
            <FontAwesomeIcon
              icon={faCheckSquare}
              size="2x"
              className="mx-2 mt-3"
            />
          </div>
        ) : null}
      </div>
    </li>
  );
};

export default PlayerInfo;
