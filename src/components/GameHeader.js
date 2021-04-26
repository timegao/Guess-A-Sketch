import GameClock from "./GameClock";
import GameRound from "./GameRound";
import GameWord from "./GameWord";

const GameHeader = () => {
  return (
    <div className="container">
      <div className="row align-items-center">
        <div className="col-sm">
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            data-bs-toggle="modal"
            data-bs-target="#leaveGameModal"
          ></button>
          <GameClock />
        </div>
        {/* <div className="col-sm"></div> */}
        <div className="col-sm text-center">
          <GameWord />
        </div>
        <div className="col-sm text-center">
          <GameRound />
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
