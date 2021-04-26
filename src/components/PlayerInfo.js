import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare, faPenSquare } from "@fortawesome/free-solid-svg-icons";
import { AVATAR_MAP, ROLE } from "../redux/stateConstants";
import { getPlayer } from "../redux/player";
import { useSelector } from "react-redux";

const PlayerInfo = ({ user }) => {
  const player = useSelector(getPlayer);
  let bgColor =
    player.username === user.username ? "rgb(246, 247, 199)" : "inherit";
  return (
    <div className="row player">
      <div className="col-2">
        <div>
          <FontAwesomeIcon icon={AVATAR_MAP[user.avatar]} size="2x" />
        </div>
      </div>
      <div className="col-8">
        <div className="user-data" style={{ backgroundColor: bgColor }}>
          <p style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            <strong>{user.username}</strong>
          </p>
          <div>{"points: " + user.scoring.score} </div>
        </div>
      </div>
      <div className="col-2">
        {user.role === ROLE.DRAWER || user.scoring.order > 0 ? (
          <div>
            <FontAwesomeIcon
              icon={user.role === ROLE.DRAWER ? faPenSquare : faCheckSquare}
              size="2x"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PlayerInfo;
