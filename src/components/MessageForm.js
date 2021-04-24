import { useState } from "react";
import { useDispatch } from "react-redux";
import { newMessage } from "../redux/actions";

const MessageForm = () => {
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(newMessage(message));
    setMessage("");
  };

  const onKeyUp = (e) => {
    if (e.key === "Enter" && message.length > 0) handleSubmit();
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
        disabled={message.length === 0}
        onClick={() => handleSubmit()}
      >
        Send
      </button>
    </form>
  );
};

export default MessageForm;
