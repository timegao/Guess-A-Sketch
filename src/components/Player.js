import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserNinja,
  faUserAstronaut,
  faUserTie,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const AVATAR_SIZE = 4;

/** Helper to assign a random avatar to the player display. */
const getAvatar = () => {
  const avatars = [faUserNinja, faUserAstronaut, faUserTie, faUser];
  return avatars[Math.floor(Math.random() * AVATAR_SIZE)];
};

const Player = (props) => {
  return (
    <li className="player">
      <div className="d-inline-flex mx-1">
        <div className="mx-2 mt-3">
          <FontAwesomeIcon icon={getAvatar()} size="2x" />
        </div>
        <div className="user-data">
          <p>
            <strong>{props.user.username}</strong>
          </p>
          <p>{"points: " + props.user.score} </p>
        </div>
      </div>
    </li>
  );
};

export default Player;
