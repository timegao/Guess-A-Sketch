import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { newPlayer } from "../redux/actions";
import { getLogin } from "../redux/player";
import { LOGIN, AVATAR_MAP } from "../redux/stateConstants";
import Select from "react-select";

const createAvatarOptions = (avatarMap) => {
  const options = Object.entries(avatarMap).map(([key, value]) => {
    return { value: key, label: <FontAwesomeIcon icon={value} size="2x" /> };
  });
  return options;
};

const JoinChat = () => {
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(null);
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
      dispatch(newPlayer(username, avatar.value));
    }
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
          <div className="col-6">
            <input
              aria-label="Your username"
              type="text"
              className="form-control has-validation"
              id="username"
              placeholder="Username"
              value={username}
              onChange={handleChange}
            />
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
          <div className="col-6">
            <Select
              className="selectAvatar"
              placeholder="Choose Avatar"
              options={createAvatarOptions(AVATAR_MAP)}
              onChange={(e) => setAvatar(e)}
            />
          </div>
          <div className="col-auto">
            <button
              type="button"
              className="btn btn-primary float-right btn-lg mt-2"
              onClick={verifyUsername}
              disabled={
                (!editingBegun && login === LOGIN.INVALID) ||
                !validLength ||
                !avatar
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
