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

  const verifyUsername = (e) => {
    if (isNotEmpty && isNotLong && checked) {
      setEditingBegun(false);
      dispatch(newPlayer(username, avatar.value));
      e.preventDefault();
    }
  };

  return (
    <>
      <div className="my-4 logo">
        <img
          src={process.env.PUBLIC_URL + "/logo.png"}
          className="d-block w-75 mx-auto"
          alt="Guess-A-Sketch Logo"
        />
      </div>
      <form className="row my-4 add-form" onSubmit={verifyUsername}>
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
              type="submit"
              className="btn btn-primary float-right mt-2"
              onClick={verifyUsername}
              disabled={
                (!editingBegun && login === LOGIN.INVALID) ||
                !isNotEmpty ||
                !isNotLong ||
                !avatar
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
              data-bs-toggle="modal"
              data-bs-target="#tutorialGameModal"
            >
              <span className="me-2">
                <FontAwesomeIcon icon={faInfoCircle} size="1x" />
              </span>
              Tutorial
            </button>
          </div>
          <div className="col-12">
            <div className="form-check mt-2">
              <input
                className="form-check-input"
                type="checkbox"
                value={checked}
                id="invalidCheck2"
                required
                onChange={() => setChecked(!checked)}
              />
              <label className="form-check-label" htmlFor="invalidCheck2">
                I have viewed the tutorial.
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
