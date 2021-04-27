import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faEraser } from "@fortawesome/free-solid-svg-icons";
import { INITIAL_STROKE, ERASER_STROKE } from "../redux/stateConstants";

const CanvasInputs = ({ stroke, setStroke, point }) => {
  const { color, lineWidth } = stroke;
  const onHandleErase = () => {
    document.body.style.cursor = "cell"; // TODO (Tim): maybe something expressive?
    setStroke(ERASER_STROKE);
  };

  const onHandleDraw = () => {
    document.body.style.cursor = "default";
    setStroke(INITIAL_STROKE);
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
            onChange={(e) => setStroke({ ...point, color: e.target.value })}
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
            onChange={(e) =>
              setStroke({ ...stroke, lineWidth: e.target.value })
            }
          />
          <input
            type="range"
            className="form-range"
            id="lineWidth2"
            min="1"
            max="65"
            value={lineWidth}
            onChange={(e) =>
              setStroke({ ...stroke, lineWidth: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CanvasInputs;
