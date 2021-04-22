import { useSelector } from "react-redux";
import { useEffect } from "react";
import Loading from "../components/Loading";
import DrawerChoosingModal from "../components/DrawerChoosingModal";
import GuesserWaitingModal from "../components/GuesserWaitingModal";
import GameStandingModal from "../components/GameStandingModal";
import ScoreUpdateModal from "../components/ScoreUpdateModal";
import { getGameState } from "../redux/game";
import { GAME_STATE, ROLE } from "../redux/stateConstants";
import { getUsers } from "../redux/users";
import { getPlayer } from "../redux/player";
import { Modal } from "bootstrap";

// singleton modal instance
let modalInstance = null;

const conditionalRender = (gameState, duty) => {
  switch (gameState) {
    case GAME_STATE.GAME_WAITING:
      return <Loading msg="Waiting for a player to join." />;
    case GAME_STATE.TURN_START: {
      if (duty === ROLE.GUESSER) {
        return <GuesserWaitingModal />;
      } else if (duty === ROLE.DRAWER) {
        return <DrawerChoosingModal />;
      } else {
        console.log("User does not have role of drawer or guesser!");
        return <Loading msg="Waiting for a player to join." />;
      }
    }
    case GAME_STATE.TURN_END:
      return <ScoreUpdateModal />;
    case GAME_STATE.GAME_OVER:
      return <GameStandingModal />;
    default:
      return "";
  }
};

const returnModal = (myModalEl) => {
  if (modalInstance === null) {
    modalInstance = new Modal(myModalEl, {
      backdrop: "static",
      keyboard: false,
      dismiss: "modal-backdrop",
    });
  }
  return modalInstance;
};

const DynamicModal = () => {
  const gameState = useSelector(getGameState);
  const users = useSelector(getUsers);
  const player = useSelector(getPlayer);
  // It takes time for addPlayer to hit server and come back
  // In the meantime, load the loading screen
  const role =
    Object.keys(users).length > 0 &&
    Object.keys(player).length > 0 &&
    typeof users[player.username] !== "undefined"
      ? users[player.username].role
      : null;

  useEffect(() => {
    const myModalEl = document.getElementById("dynamicModal");
    const modal = returnModal(myModalEl);
    if (gameState === GAME_STATE.TURN_DURING) {
      // close modal
      modal.hide();
    } else {
      // open modal
      modal.show();
    }
  }, [gameState]);

  return (
    <div
      className="modal"
      id="dynamicModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="dynamicModal"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          {conditionalRender(gameState, role)}
        </div>
      </div>
    </div>
  );
};

export default DynamicModal;
