import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faPlayCircle } from "@fortawesome/free-solid-svg-icons";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { newPlayer } from "../redux/actions";
import { getLogin } from "../redux/player";
import { LOGIN, AVATAR_MAP } from "../redux/stateConstants";
import Select from "react-select";
import TutorialModal from "./TutorialModal";

const createAvatarOptions = (avatarMap) => {
  const options = Object.entries(avatarMap).map(([key, value]) => {
    return { value: key, label: <FontAwesomeIcon icon={value} size="2x" /> };
  });
  return options;
};

const MAXIMUM_LENGTH = 16;

const JoinChat = () => {
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [isNotEmpty, setIsNotEmpty] = useState(false);
  const [isNotLong, setIsNotLong] = useState(false);
  const login = useSelector(getLogin);
  const [editingBegun, setEditingBegun] = useState(false);
  const [checked, setChecked] = useState(false);

  const dispatch = useDispatch();

  const validateUsername = (username) => {
    if (username.length === 0) {
      setIsNotEmpty(false);
    } else {
      setIsNotEmpty(true);
    }
    if (username.length > MAXIMUM_LENGTH) {
      setIsNotLong(false);
    } else {
      setIsNotLong(true);
    }
  };

  const handleChange = (e) => {
    setEditingBegun(true);
    validateUsername(e.target.value);
    setUsername(e.target.value);
  };

  const verifyUsername = () => {
    if (isNotEmpty && isNotLong) {
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
            <div
              className="invalid-feedback"
              style={
                editingBegun && isNotEmpty === false
                  ? { display: "block" }
                  : { display: "none" }
              }
            >
              Username cannot be empty!
            </div>
            <div
              className="invalid-feedback"
              style={
                editingBegun && isNotLong === false
                  ? { display: "block" }
                  : { display: "none" }
              }
            >
              Username cannot be longer than {MAXIMUM_LENGTH} characters!
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
              className="btn btn-primary float-right mt-2"
              onClick={verifyUsername}
              disabled={
                (!editingBegun && login === LOGIN.INVALID) ||
                !isNotEmpty ||
                !isNotLong ||
                !avatar ||
                !checked
              }
            >
              <span className="me-2">
                <FontAwesomeIcon icon={faPlayCircle} size="1x" />
              </span>
              Play!
            </button>
          </div>
          <div className="col-auto">
            <button
              type="button"
              className="btn btn-warning float-right mt-2"
              onClick={verifyUsername}
              data-bs-toggle="modal"
              data-bs-target="#tutorialGameModal"
            >
              <span className="me-2">
                <FontAwesomeIcon icon={faInfoCircle} size="1x" />
              </span>
              Tutorial
            </button>
          </div>
          <div class="col-12">
            <div class="form-check mt-2">
              <input
                class="form-check-input"
                type="checkbox"
                value={checked}
                id="invalidCheck"
                required
                onChange={(e) => setChecked(!checked)}
              />
              <label class="form-check-label" for="invalidCheck">
                You have viewed the tutorial.
              </label>
            </div>
          </div>
        </div>
      </form>
      <TutorialModal />
    </>
  );
};

export default JoinChat;
