import { useState } from "react";
import { useDispatch } from "react-redux";

import { newPlayer } from "../redux/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";

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
    <>
      <div className="my-4 logo">
        <span>
          <h1>Place Logo Here</h1>
        </span>
      </div>
      <form className="row my-4 add-form" onSubmit={(e) => e.preventDefault()}>
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
              className="btn btn-primary float-right btn-lg"
              onClick={verifyUsername}
            >
              <span className="mx-2">
                <FontAwesomeIcon icon={faPlayCircle} size="1x" />
              </span>
              Play!
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default JoinChat;
