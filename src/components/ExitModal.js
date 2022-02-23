import { useDispatch } from "react-redux";
import { Modal } from "bootstrap";
import { exitGame } from "../redux/actions";
import { getDynamicModalInstance } from "./DynamicModal";

const ExitModal = () => {
  const dispatch = useDispatch();

  const confirmExitGame = () => {
    let leaveGameModalDiv = document.getElementById("leaveGameModal");
    let leaveGameModal = Modal.getInstance(leaveGameModalDiv);
    let dynamicModal = getDynamicModalInstance();
    if (dynamicModal !== null) {
      dynamicModal.hide(); // close dynamic modal if open before leaving
    }
    dispatch(exitGame());
    leaveGameModal.hide(); //close modal before leaving
  };

  return (
    <div
      className="modal"
      id="leaveGameModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="leaveGameModalLabel"
      // aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="leaveGameModalLabel">
              Exit Game
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            Are you sure you want to leave the game?
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={confirmExitGame}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitModal;
