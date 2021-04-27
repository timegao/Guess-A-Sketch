import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare, faPenSquare } from "@fortawesome/free-solid-svg-icons";
import { AVATAR_MAP, ROLE } from "../redux/stateConstants";
import { getPlayer } from "../redux/player";
import { useSelector } from "react-redux";

const PlayerInfo = ({ user }) => {
  const player = useSelector(getPlayer);
  let bgColor =
    player.username === user.username ? "rgb(246, 247, 199)" : "#f3f3f3";
  return (
    <li className="player" style={{ backgroundColor: bgColor }}>
      <span className="float-start">
        <FontAwesomeIcon icon={AVATAR_MAP[user.avatar]} size="2x" />
      </span>
      {user.role === ROLE.DRAWER || user.scoring.order > 0 ? (
        <span className="float-end">
          <FontAwesomeIcon
            icon={user.role === ROLE.DRAWER ? faPenSquare : faCheckSquare}
            size="2x"
          />
        </span>
      ) : null}
      <div className="row text-start">
        <div className="user-data">
          <p style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            <strong>{user.username}</strong>
            <br />
            {"points: " + user.scoring.score}
          </p>
        </div>
      </div>
    </li>
  );
};

export default PlayerInfo;
