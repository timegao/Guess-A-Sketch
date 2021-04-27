import { useSelector } from "react-redux";
import { getUsers } from "../redux/users";
import PlayerInfo from "../components/PlayerInfo";

const PlayerList = () => {
  const users = useSelector(getUsers);
  return (
    <div className="row">
      <div className="justify-content-center">
        <ul className="scrollable">
          {Object.keys(users).map((user, i) => (
            <PlayerInfo user={users[user]} key={i} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlayerList;
