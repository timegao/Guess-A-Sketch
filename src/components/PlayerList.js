import { useSelector } from "react-redux";
import { getUsers } from "../redux/users";
import Player from "../components/Player";

const PlayerList = () => {
  const users = useSelector(getUsers);
  return (
    <div className="row">
      <ul>
        {Object.keys(users).map((user, i) => (
          <Player user={users[user]} key={i} />
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;
