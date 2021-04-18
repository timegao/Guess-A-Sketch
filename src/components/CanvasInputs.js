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
    //   <form>
    //     <div className="row">
    //       <button
    //         type="button"
    //         className="btn btn-primary btn-lg m-3"
    //         onClick={() => onHandleDraw()}
    //       >
    //         Draw
    //       </button>
    //       <button
    //         type="button"
    //         className="btn btn-primary btn-lg m-3"
    //         onClick={() => onHandleErase()}
    //       >
    //         Erase
    //       </button>
    //       <div className="col">
    //         <label htmlFor="strokeColor" className="form-label mt-3">
    //           Stroke color:
    //         </label>
    //         <input
    //           className="form-control form-control-color"
    //           type="color"
    //           id="strokeColor"
    //           name="color"
    //           value={color}
    //           onChange={(e) => setStroke({ ...point, color: e.target.value })}
    //         />
    //       </div>
    //       <div className="col">
    //         <label htmlFor="lineWidth" className="form-label mt-3">
    //           Line width:
    //         </label>
    //         <input
    //           className="form-control"
    //           type="number"
    //           id="lineWidth"
    //           name="width"
    //           min="1"
    //           max="10"
    //           value={lineWidth}
    //           onChange={(e) =>
    //             setStroke({ ...stroke, lineWidth: e.target.value })
    //           }
    //         />
    //       </div>
    //     </div>
    //   </form>
    // );

    <div className="input-group mb-3">
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => onHandleDraw()}
      >
        Draw
      </button>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => onHandleErase()}
      >
        Erase
      </button>
      <span className="input-group-text">Color:</span>
      <input
        className="form-control form-control-color"
        type="color"
        id="strokeColor"
        name="color"
        value={color}
        onChange={(e) => setStroke({ ...point, color: e.target.value })}
      />
      <span className="input-group-text">Line width:</span>
      <input
        className="form-control"
        type="number"
        id="lineWidth"
        name="width"
        min="1"
        max="10"
        value={lineWidth}
        onChange={(e) => setStroke({ ...stroke, lineWidth: e.target.value })}
      />
    </div>
  );
};

export default CanvasInputs;
