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
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="row">
        <div className="col">
          <input
            aria-label="Your message"
            type="text"
            className="form-control"
            id="messageTxt"
            placeholder="Enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyUp={onKeyUp}
          />
        </div>
        <div className="col-auto">
          <button
            type="button"
            className="btn btn-primary float-right"
            onClick={() => handleSubmit()}
          >
            Send
          </button>
        </div>
      </div>
      <div className="row my-2"></div>
    </form>
  );
};

export default MessageForm;
