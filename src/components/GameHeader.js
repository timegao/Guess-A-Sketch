import GameClock from "./GameClock";
import GameRound from "./GameRound";
import GameWord from "./GameWord";

const GameHeader = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-sm">
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
          ></button>
        </div>
        <div className="col-sm">
          <GameClock />
        </div>
        <div className="col-sm">
          <GameWord />
        </div>
        <div className="col-sm">
          <GameRound />
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
