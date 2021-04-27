import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { newMessage } from "../redux/actions";
import { getPlayer } from "../redux/player";
import { ROLE } from "../redux/stateConstants";
import { getUsers } from "../redux/users";
import { Tooltip } from "bootstrap";

const isValid = (message, users, player) =>
  message.length > 0 && users[player.username].role !== ROLE.DRAWER;

const MessageForm = () => {
  const [message, setMessage] = useState("");
  const users = useSelector(getUsers);
  const player = useSelector(getPlayer);
  const [tooltipOpen, toggleTooltip] = useState(false);
  const tooltipRef = useRef();

  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(newMessage(message));
    setMessage("");
  };

  const onKeyUp = (e) => {
    if (e.key === "Enter" && isValid(message, users, player)) handleSubmit();
  };

  useEffect(() => {
    let tooltip = tooltipRef.current;
    let bsTooltip = Tooltip.getInstance(tooltip);

    if (!bsTooltip) {
      bsTooltip = new Tooltip(tooltip);
    } else {
      users[player.username].role === ROLE.DRAWER && tooltipOpen
        ? bsTooltip.show()
        : bsTooltip.hide();
    }
  }, [player.username, tooltipOpen, users]);

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <input
        ref={tooltipRef}
        aria-label="Your message"
        type="text"
        className="form-control"
        id="messageTxt"
        placeholder="Enter message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyUp={onKeyUp}
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        data-bs-trigger="manual"
        title="Drawer can't send messages on the chat."
        readOnly={users[player.username].role === ROLE.DRAWER}
        onPointerEnter={() => toggleTooltip(true)}
        onFocus={() => toggleTooltip(true)}
        onPointerOut={() => toggleTooltip(false)}
        onBlur={() => toggleTooltip(false)}
      />
      <button
        type="button"
        className="btn btn-primary float-right w-100 mt-2"
        disabled={!isValid(message, users, player)}
        onClick={() => handleSubmit()}
      >
        Send
      </button>
    </form>
  );
};

export default MessageForm;
