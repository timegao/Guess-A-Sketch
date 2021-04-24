import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { newMessage } from "../redux/actions";
import { getPlayer } from "../redux/player";
import { ROLE } from "../redux/stateConstants";
import { getUsers } from "../redux/users";

const MessageForm = () => {
  const [message, setMessage] = useState("");
  const [valid, setValid] = useState(false);
  const users = useSelector(getUsers);
  const player = useSelector(getPlayer);

  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(newMessage(message));
    setMessage("");
  };

  useEffect(() => {
    setValid(message.length > 0 && users[player.username].role !== ROLE.DRAWER);
  }, [users, player, message]);

  const onKeyUp = (e) => {
    if (e.key === "Enter" && valid) handleSubmit();
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <input
        aria-label="Your message"
        type="text"
        className="form-control"
        id="messageTxt"
        placeholder="Enter message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyUp={onKeyUp}
      />
      <button
        type="button"
        className="btn btn-primary float-right w-100 mt-2"
        disabled={!valid}
        onClick={() => handleSubmit()}
      >
        Send
      </button>
    </form>
  );
};

export default MessageForm;
