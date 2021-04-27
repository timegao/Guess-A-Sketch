import { useSelector } from "react-redux";
import { getUsers } from "../redux/users";
import { AVATAR_MAP } from "../redux/stateConstants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/** Helper to sort users in descending order based on score*/
const sortUsersScore = (users) => {
  return Object.values(users).sort((a, b) => b.scoring.score - a.scoring.score);
};

const GameStandingModal = () => {
  const users = useSelector(getUsers);
  const sortedUsers = sortUsersScore(users);

  return (
    <div className="modal-body loading">
      <h1>The winners are...</h1>
      <ul className="score-modal">
        {sortedUsers.map((user, i) => (
          <li className="player-score" key={i}>
            <div className="row mt-1">
              <div className="col mt-2">
                <span className="fs-3">{i + 1 + ". "}</span>
                <span>
                  <FontAwesomeIcon icon={AVATAR_MAP[user.avatar]} size="2x" />
                </span>
              </div>
              <div
                className="col mt-1"
                style={{ overflow: "hidden", textOverflow: "ellipsis" }}
              >
                {user.username}
              </div>
              <div className="col score-earned mt-1">{user.scoring.score}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameStandingModal;
