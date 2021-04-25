import { useSelector } from "react-redux";
import { getUsers } from "../redux/users";

/** Helper to sort users in descending order based on score*/
const sortUsersScore = (users) => {
  let sortedUsers = Object.values(users);
  return sortedUsers.sort((a, b) => b.score - a.score);
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
            <div className="row">
              <div className="col">{i + 1 + ". " + user.username}</div>
              <div className="col">{user.score + " points"}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameStandingModal;
