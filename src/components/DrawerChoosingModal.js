import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWordChoices, sendChosenWord } from "../redux/actions";
import { getWord } from "../redux/word";
const DrawerChoosingModal = () => {
  const dispatch = useDispatch();
  const { choices } = useSelector(getWord);

  useEffect(() => {
    dispatch(getWordChoices());
  }, [dispatch]);

  const submitChosenWord = (e) => {
    dispatch(sendChosenWord(e.target.innerText));
  };

  return (
    <div className="modal-body">
      <div className="text-center">
        <h1>Choose your word!</h1>
        <button
          type="button"
          className="btn btn-success me-3"
          onClick={submitChosenWord}
        >
          {choices.easy}
        </button>
        <button
          type="button"
          className="btn btn-warning me-3"
          onClick={submitChosenWord}
        >
          {choices.medium}
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={submitChosenWord}
        >
          {choices.hard}
        </button>
      </div>
    </div>
  );
};

export default DrawerChoosingModal;
