import { useSelector } from "react-redux";
import { getUsers } from "../redux/users";
import { getPickedWord } from "../redux/word";
import { AVATAR_MAP } from "../redux/stateConstants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/** Helper to sort users in descending order based on earned*/
const sortUsersWonTurn = (users) => {
  return Object.values(users).sort(
    (a, b) => b.scoring.earned - a.scoring.earned
  );
};

const ScoreUpdateModal = () => {
  const users = useSelector(getUsers);
  const pickedWord = useSelector(getPickedWord);
  const sortedUsers = sortUsersWonTurn(users);

  return (
    <div className="modal-body loading">
      <h1>{"The word was " + pickedWord}</h1>
      <ul className="score-modal">
        {sortedUsers.map((user, i) => (
          <li className="player-score" key={i}>
            <div className="row mt-1">
              <div className="col mt-2">
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
              <div className="col score-earned mt-1">
                +{user.scoring.earned}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScoreUpdateModal;
