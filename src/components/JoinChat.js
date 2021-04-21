import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { newPlayer } from "../redux/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import { getUsers } from "../redux/users";

const JoinChat = () => {
  const [username, setUsername] = useState("");
  const [validLength, setValidLength] = useState(true);
  const [validName, setValidName] = useState(true);
  const users = useSelector(getUsers);

  const dispatch = useDispatch();

  const validateUsername = (username) => {
    if (username.length === 0) {
      setValidLength(false);
    } else {
      setValidLength(true);
    }
    if (users.hasOwnProperty(username)) {
      setValidName(false);
    } else {
      setValidName(true);
    }
  };

  const handleChange = (e) => {
    validateUsername(e.target.value);
    setUsername(e.target.value);
  };

  const verifyUsername = () => {
    if (validLength && validName) {
      dispatch(newPlayer(username));
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
              invalid={`${validLength === false || validName === false}`}
              valid={`${validLength === true && validName === true}`}
              placeholder="Username"
              value={username}
              onChange={handleChange}
              onKeyUp={onKeyUp}
            />
            <div
              className="invalid-feedback"
              style={
                validLength === false
                  ? { display: "block" }
                  : { display: "none" }
              }
            >
              Username cannot be empty!
            </div>
            <div
              className="invalid-feedback"
              style={
                validName === false ? { display: "block" } : { display: "none" }
              }
            >
              Username already in use!
            </div>
          </div>
          <div className="col-auto">
            <button
              type="button"
              className="btn btn-primary float-right btn-lg"
              onClick={verifyUsername}
              disabled={!validName || !validLength}
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
