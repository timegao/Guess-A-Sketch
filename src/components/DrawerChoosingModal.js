import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWordChoices, sendChosenWord } from "../redux/actions";
import { getWords } from "../redux/game";
const DrawerChoosingModal = () => {
  const dispatch = useDispatch();
  const wordChoices = useSelector(getWords);

  useEffect(() => {
    dispatch(getWordChoices());
  }, [dispatch]);

  const submitChosenWord = (e) => {
    dispatch(sendChosenWord(e.target.innerText));
  };

  return (
    <div className="modal-body">
      <h1>Choose your word!</h1>
      <button
        type="button"
        className="btn btn-success me-3"
        onClick={submitChosenWord}
      >
        {wordChoices.easy}
      </button>
      <button
        type="button"
        className="btn btn-warning me-3"
        onClick={submitChosenWord}
      >
        {wordChoices.medium}
      </button>
      <button
        type="button"
        className="btn btn-danger"
        onClick={submitChosenWord}
      >
        {wordChoices.hard}
      </button>
    </div>
  );
};

export default DrawerChoosingModal;
