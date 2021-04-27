import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faEraser,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import { INITIAL_STROKE, ERASER_STROKE, ROLE } from "../redux/stateConstants";
import { newClearedCanvas } from "../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../redux/users";
import { getPlayer } from "../redux/player";

const CanvasInputs = ({ stroke, setStroke, point }) => {
  const users = useSelector(getUsers);
  const player = useSelector(getPlayer);
  const dispatch = useDispatch();
  const { color, lineWidth } = stroke;

  const isDrawer = () => {
    return users[player.username].role === ROLE.DRAWER;
  };

  const onHandleErase = () => {
    if (isDrawer()) {
      document.body.style.cursor = "cell"; // TODO (Tim): maybe something expressive?
      setStroke(ERASER_STROKE);
    }
  };

  const onHandleDraw = () => {
    if (isDrawer()) {
      document.body.style.cursor = "default";
      setStroke(INITIAL_STROKE);
    }
  };

  const onClearCanvas = () => {
    if (isDrawer()) {
      dispatch(newClearedCanvas());
    }
  };

  const onHandleSetStrokeColor = (e) => {
    if (isDrawer()) {
      setStroke({ ...point, color: e.target.value });
    }
  };

  const onHandleSetStrokeLineWidth = (e) => {
    if (isDrawer()) {
      setStroke({ ...stroke, lineWidth: e.target.value });
    }
  };

  return (
    <div className="row align-items-center justify-content-center">
      <div className="col-sm">
        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onHandleDraw()}
          >
            Draw
            <span className="ms-2">
              <FontAwesomeIcon icon={faPencilAlt} />
            </span>
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onHandleErase()}
          >
            Erase
            <span className="ms-2">
              <FontAwesomeIcon icon={faEraser} />
            </span>
          </button>
          <button
            type="button"
            className="btn btn-warning"
            onClick={() => onClearCanvas()}
          >
            Clear
            <span className="ms-2">
              <FontAwesomeIcon icon={faWindowClose} />
            </span>
          </button>
        </div>
      </div>
      <div className="col-sm">
        <div className="input-group" style={{ borderBottom: "none" }}>
          <span className="input-group-text">Color:</span>
          <input
            className="form-control form-control-color"
            type="color"
            id="strokeColor"
            name="color"
            value={color}
            onChange={(e) => onHandleSetStrokeColor(e)}
          />
        </div>
      </div>
      <div className="col-sm">
        <div className="input-group">
          <span className="input-group-text">Line width:</span>
          <input
            className="form-control"
            type="number"
            id="lineWidth1"
            name="width"
            min="1"
            max="65"
            value={lineWidth}
            onChange={(e) => onHandleSetStrokeLineWidth(e)}
          />
          <input
            type="range"
            className="form-range"
            id="lineWidth2"
            min="1"
            max="65"
            value={lineWidth}
            onChange={(e) => onHandleSetStrokeLineWidth(e)}
          />
        </div>
      </div>
    </div>
  );
};

export default CanvasInputs;
