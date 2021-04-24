import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getHint, getWordToGuess } from "../redux/game";
import { getPlayer } from "../redux/player";
import { ROLE } from "../redux/stateConstants";
import { getUsers } from "../redux/users";

// TO DO: if we later keep drawer reference in store, this could be replaced with simple to check
// that current user is not the drawer.
const isGuesserPlayer = (player, users) => {
  return users[player.username].role === ROLE.GUESSER;
};

const GameWord = () => {
  const player = useSelector(getPlayer);
  const users = useSelector(getUsers);
  const hint = useSelector(getHint);
  const wordToGuess = useSelector(getWordToGuess);
  return (
    <>
      {isGuesserPlayer(player, users) ? (
        <div>{hint}</div>
      ) : (
        <div>{wordToGuess}</div>
      )}
    </>
  );
};

export default GameWord;
