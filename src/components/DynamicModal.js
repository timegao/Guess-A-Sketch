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
  const role =
    Object.keys(users).length > 0 &&
    Object.keys(player).length > 0 &&
    typeof users[player.username] !== "undefined"
      ? users[player.username].role
      : null;

  useEffect(() => {
    const myModalEl = document.getElementById("dynamicModal");
    if (gameState === GAME_STATE.TURN_DURING) {
      // close modal
      const modal = Modal.getInstance(myModalEl, { backdrop: "false" });
      modal.hide();
    } else {
      // open modal
      const modal = new Modal(myModalEl, {
        backdrop: "static",
        keyboard: false,
        dismiss: "modal",
      });
      modal.show();
    }
  }, [gameState]);

  return (
    <div
      className="modal fade"
      id="dynamicModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="dynamicModal"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          {/* <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">
              Modal title
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div> */}
          <div class="modal-body">{conditionalRender(gameState, role)}</div>
          {/* <div class="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button type="button" className="btn btn-primary">
              Understood
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default DynamicModal;
