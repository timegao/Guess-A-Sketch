import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { addLine } from "../client";
import { getLine } from "../redux/lines";

// Used to initialize stroke state and revert to initial state
const INITIAL_STROKE = {
  lineWidth: 8,
  color: "#000000", // black
};

const draw = (context, x0, y0, x1, y1, color, lineWidth) => {
  context.beginPath();
  context.moveTo(x0, y0);
  context.lineTo(x1, y1);
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.stroke();
  context.closePath();
};

const Canvas = () => {
  const [drawing, setDrawing] = useState(false);
  const lines = useSelector(getLine);

  // Point state. Point represents an x and y coordinate
  const [point, setPoint] = useState({
    x: 0,
    y: 0,
  });

  // Stroke state. Stroke represents lineWidth and color
  const [stroke, setStroke] = useState(INITIAL_STROKE);

  const { x, y } = point;
  const { lineWidth, color } = stroke;

  const canvasRef = useRef(null);

  /**
   * User either presses a left-click on mouse or touches a touchscreen
   * Starts the drawing and sets the coordinates of first point
   * @param {Object} e event object with x/y coordinates
   */
  const onMouseDown = (e) => {
    setDrawing(true);
    setPoint({
      ...point,
      x: e.clientX || (e.touches && e.touches[0].clientX),
      y: e.clientY || (e.touches && e.touches[0].clientY),
    });
  };

  /**
   * User either moves a mouse or moves on a touchscreen
   * Continues the drawing if drawing is true
   * and continues adding line objects to Redux state lines
   * @param {Object} e event object with x/y coordinates
   */
  const onMouseMove = (e) => {
    if (!drawing) return;
    addLine({
      x0: x,
      y0: y,
      x1: e.clientX || (e.touches && e.touches[0].clientX),
      y1: e.clientY || (e.touches && e.touches[0].clientY),
      color,
      lineWidth,
    });
    setPoint({
      ...point,
      x: e.clientX || (e.touches && e.touches[0].clientX),
      y: e.clientY || (e.touches && e.touches[0].clientY),
    });
  };

  /**
   * User either releases a left-click on mouse or lets go a touchscreen
   * Sets drawing to false to stop drawing
   * Adds final line object to Redux state lines
   * @param {Object} e event object with x/y coordinates
   * @returns
   */
  const onMouseUp = (e) => {
    if (!drawing) return;
    setDrawing(false);
    addLine({
      x0: x,
      y0: y,
      x1: e.clientX || (e.touches && e.touches[0].clientX),
      y1: e.clientY || (e.touches && e.touches[0].clientY),
      color,
      lineWidth,
    });
  };

  /**
   * Draws all the lines from Redux state lines
   */
  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    lines.forEach((line) =>
      draw(
        context,
        line.x0,
        line.y0,
        line.x1,
        line.y1,
        line.color,
        line.lineWidth
      )
    );
  }, [lines]);

  return (
    <>
      <canvas
        ref={canvasRef}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
        onMouseOut={onMouseUp}
        onMouseMove={onMouseMove}
        onTouchStart={onMouseDown}
        onTouchEnd={onMouseUp}
        onTouchCancel={onMouseUp}
        onTouchMove={onMouseMove}
        // width={window.innerWidth}
        // height={window.innerHeight}
      />
    </>
  );
};

export default Canvas;
