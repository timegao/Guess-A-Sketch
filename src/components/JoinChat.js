import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { newPlayer } from "../redux/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import { getLogin } from "../redux/player";
import { LOGIN } from "../redux/stateConstants";

const JoinChat = () => {
  const [username, setUsername] = useState("");
  const [validLength, setValidLength] = useState(false);
  const login = useSelector(getLogin);
  const [editingBegun, setEditingBegun] = useState(false);

  const dispatch = useDispatch();

  const validateUsername = (username) => {
    if (username.length === 0) {
      setValidLength(false);
    } else {
      setValidLength(true);
    }
  };

  const handleChange = (e) => {
    setEditingBegun(true);
    validateUsername(e.target.value);
    setUsername(e.target.value);
  };

  const verifyUsername = () => {
    if (validLength) {
      setEditingBegun(false);
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
              invalid={`${
                validLength === false ||
                (!editingBegun && login === LOGIN.INVALID)
              }`}
              valid={`${validLength === true && login === LOGIN.VALID}`}
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
                !editingBegun && login === LOGIN.INVALID
                  ? { display: "block" }
                  : { display: "none" }
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
              disabled={
                (!editingBegun && login === LOGIN.INVALID) || !validLength
              }
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
