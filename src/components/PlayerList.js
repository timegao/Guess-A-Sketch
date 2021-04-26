import { useSelector } from "react-redux";
import { getUsers } from "../redux/users";
import PlayerInfo from "../components/PlayerInfo";

const PlayerList = () => {
  const users = useSelector(getUsers);
  return (
    <div class="justify-content-md-center">
      {Object.keys(users).map((user, i) => (
        <PlayerInfo user={users[user]} key={i} />
      ))}
    </div>
  );
};

export default PlayerList;
