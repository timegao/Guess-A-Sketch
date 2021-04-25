import { useSelector } from "react-redux";
import { getUsers } from "../redux/users";
import { getPickedWord } from "../redux/word";

/** Helper to sort users in descending order based on those who wonTurn first*/
const sortUsersWonTurn = (users) => {
  let sortedUsers = Object.values(users);
  return sortedUsers.sort((a, b) =>
    a.wonTurn === b.wonTurn
      ? 0
      : a.wonTurn === true && b.wonTurn === false
      ? -1
      : 1
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
            <div className="row">
              <div className="col">{user.username}</div>
              <div className="col">{user.wonTurn === true ? "+1" : "0"}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScoreUpdateModal;
