import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faPhoneSlash,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";

const TutorialModal = () => {
  return (
    <div
      className="modal fade"
      id="tutorialGameModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="tutorialGameModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="tutorialGameModalLabel">
              Tutorial
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="card">
              <div className="card-body">
                <div className="col-auto text-center">
                  When its your turn, <strong>DRAW</strong> your chosen word!
                </div>
                <div className="col-auto text-center">
                  <span className="fs-1">
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </span>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="col-auto text-justify">
                  Otherwise, <strong>GUESS</strong> the word as quickly as you
                  can in the chat to win points!
                </div>
                <div className="col-auto text-center">
                  <span className="fs-1">
                    <FontAwesomeIcon icon={faQuestion} />
                  </span>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="col-auto text-justify">
                  Don't spoil the fun. <strong>DO NOT TELL OTHERS</strong> the
                  answer in the <strong>CHAT</strong> or on the{" "}
                  <strong>BOARD</strong>!
                </div>
                <div className="col-auto text-center">
                  <span className="fs-1">
                    <FontAwesomeIcon icon={faPhoneSlash} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;
