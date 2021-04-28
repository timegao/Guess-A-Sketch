import Chat from "./Chat";
import PlayerList from "./PlayerList";
import CanvasBoard from "./CanvasBoard";
// import DynamicModal from "./DynamicModal";
// import ExitModal from "./ExitModal";
import GameHeader from "./GameHeader";

const GameView = () => {
  return (
    <>
      {/* <ExitModal />
      <DynamicModal /> */}
      <div className="container game-view">
        <div className="row header">
          <GameHeader />
        </div>
        <div className="row">
          <div
            className="col-sm col-md-2 text-center p-0"
            id="playerListColumn"
          >
            <PlayerList />
          </div>
          <div className="col-sm col-md-8 text-center p-0">
            <CanvasBoard />
          </div>
          <div className="col-sm col-md-2 p-0">
            <Chat />
          </div>
        </div>
      </div>
    </>
  );
};

export default GameView;
