import { useState } from "react";
import { useSelector } from "react-redux";
import JoinChat from "../components/JoinChat";
import { getPlayer } from "../redux/player";
import GameView from "../components/GameView";
import CanvasInputs from "../components/CanvasInputs";
import { INITIAL_STROKE } from "../redux/stateConstants";
import { getUsers } from "../redux/users";
import Loading from "../components/Loading";

const App = () => {
  const MIN_PLAYERS = 2;
  const player = useSelector(getPlayer);
  const users = useSelector(getUsers);

  // return <>{player.hasOwnProperty("username") ? <GameView /> : <JoinChat />}</>;

  if (!player.hasOwnProperty("username")) {
    return <JoinChat />;
  } else if (
    player.hasOwnProperty("username") &&
    Object.keys(users).length < MIN_PLAYERS
  ) {
    return <Loading msg={"Waiting for another player to Join..."} />;
  } else if (
    player.hasOwnProperty("username") &&
    Object.keys(users).length >= MIN_PLAYERS
  ) {
    return <GameView />;
  }
};

export default App;
