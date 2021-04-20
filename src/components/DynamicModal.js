import { useSelector } from "react-redux";

import Loading from "../components/Loading";
import DrawerChoosingModal from "../components/DrawerChoosingModal";
import GuesserWaitingModal from "../components/GuesserWaitingModal";
import GameStandingModal from "../components/GameStandingModal";
import ScoreUpdateModal from "../components/ScoreUpdateModal";
import { getGameState } from "../redux/game";
import { GAME_STATE, ROLE } from "../redux/stateConstants";
import { getUsers } from "../redux/users";
import { getPlayer } from "../redux/player";

const conditionalRender = (gameState, duty) => {
  switch (gameState) {
    case GAME_STATE.GAME_WAITING:
      return <Loading />;
    case GAME_STATE.TURN_START: {
      if (duty === ROLE.GUESSER) {
        return <GuesserWaitingModal />;
      } else if (duty === ROLE.DRAWER) {
        return <DrawerChoosingModal />;
      } else {
        console.log("User does not have role of drawer or guesser!");
        return <Loading />;
      }
    }
    case GAME_STATE.TURN_END:
      return <ScoreUpdateModal />;
    case GAME_STATE.GAME_OVER:
      return <GameStandingModal />;
    default:
      return null;
  }
};

const DynamicModal = () => {
  const gameState = useSelector(getGameState);
  const users = useSelector(getUsers);
  const player = useSelector(getPlayer);
  // It takes time for addPlayer to hit server and come back
  // In the meantime, load the loading screen
  if (
    Object.keys(users).length > 0 &&
    Object.keys(player).length > 0 &&
    typeof users[player.username] !== "undefined"
  ) {
    const role = users[player.username].role;
    return conditionalRender(gameState, role);
  } else {
    return <Loading />;
  }
};

export default DynamicModal;
