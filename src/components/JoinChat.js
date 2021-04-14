import { useState } from "react";
import { useDispatch } from "react-redux";

import { newPlayer } from "../redux/actions";

const JoinChat = () => {
  const [username, setUsername] = useState("");
  const [isValid, setIsValid] = useState(true);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    if (e.target.value.length > 0) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
    setUsername(e.target.value);
  };

  const verifyUsername = () => {
    if (username.length > 0) {
      setIsValid(true);
      dispatch(newPlayer(username));
    } else {
      setIsValid(false);
    }
  };

  const onKeyUp = (e) => {
    if (e.key === "Enter") verifyUsername();
  };

  return (
    <form className="my-4" onSubmit={(e) => e.preventDefault()}>
      <div className="row">
        <div className="col">
          <input
            aria-label="Your username"
            type="text"
            className="form-control has-validation"
            id="username"
            invalid={`${isValid === false}`}
            valid={`${isValid === true}`}
            placeholder="Username"
            value={username}
            onChange={handleChange}
            onKeyUp={onKeyUp}
          />
          <div
            className="invalid-feedback"
            style={
              isValid === false ? { display: "block" } : { display: "none" }
            }
          >
            Username cannot be empty!
          </div>
        </div>
        <div className="col-auto">
          <button
            type="button"
            className="btn btn-primary float-right"
            onClick={verifyUsername}
          >
            Join Chat
          </button>
        </div>
      </div>
    </form>
  );
};

export default JoinChat;
