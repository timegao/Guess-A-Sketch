import Chat from "./Chat";
import PlayerList from "./PlayerList";
import CanvasBoard from "./CanvasBoard";

const GameView = () => {
  return (
    // <div className="card">
    //   <div className="card-header text-center">
    //     TODO: Header Component Goes Here
    //   </div>
    //   <div className="card-body p-0">
    //     <div className="row">
    //       <div
    //         className="col-sm col-md-2 text-center p-0"
    //         id="playerListColumn"
    //       >
    //         <PlayerList />
    //       </div>
    //       <div className="col-sm col-md-8 text-center p-0">
    //         <CanvasBoard />
    //       </div>
    //       <div className="col-sm col-md-2 p-0">
    //         <Chat />
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="container game-view">
      <div className="row header">
        <p>TODO: Header Component Goes Here</p>
      </div>
      <div className="row">
        <div className="col-sm col-md-2 text-center p-0" id="playerListColumn">
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
  );
};

export default GameView;
