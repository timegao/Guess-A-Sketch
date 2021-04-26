import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { addLine } from "../client";
import { getLine } from "../redux/lines";
import { getPlayer } from "../redux/player";
import { ROLE } from "../redux/stateConstants";
import { getUsers } from "../redux/users";

const draw = (context, x0, y0, x1, y1, color, lineWidth) => {
  context.beginPath();
  context.moveTo(x0, y0);
  context.lineTo(x1, y1);
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.stroke();
  context.closePath();
};

const Canvas = ({ setPoint, point, stroke }) => {
  const users = useSelector(getUsers);
  const player = useSelector(getPlayer);
  const [drawing, setDrawing] = useState(false);
  const lines = useSelector(getLine);

  const canvasRef = useRef(null);
  const { x, y } = point;
  const { color, lineWidth } = stroke;

  /**
   * User either presses a left-click on mouse or touches a touchscreen
   * Starts the drawing and sets the coordinates of first point
   * @param {Object} e event object with x/y coordinates
   */
  const onMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    if (users[player.username].role === ROLE.DRAWER) setDrawing(true);
    setPoint({
      ...point,
      x:
        ((e.clientX - rect.left) * canvasRef.current.width) / rect.width ||
        (e.touches &&
          e.touches[0].clientX -
            (rect.left * canvasRef.current.width) / rect.width),
      y:
        ((e.clientY - rect.top) * canvasRef.current.height) / rect.height ||
        (e.touches &&
          ((e.touches[0].e.clientY - rect.top) * canvasRef.current.height) /
            rect.height),
    });
  };

  /**
   * User either moves a mouse or moves on a touchscreen
   * Continues the drawing if drawing is true
   * and continues adding line objects to Redux state lines
   * @param {Object} e event object with x/y coordinates
   */
  const onMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    if (!drawing) return;
    addLine({
      x0: x,
      y0: y,
      x1:
        ((e.clientX - rect.left) * canvasRef.current.width) / rect.width ||
        (e.touches &&
          e.touches[0].clientX -
            (rect.left * canvasRef.current.width) / rect.width),
      y1:
        ((e.clientY - rect.top) * canvasRef.current.height) / rect.height ||
        (e.touches &&
          ((e.touches[0].e.clientY - rect.top) * canvasRef.current.height) /
            rect.height),
      color,
      lineWidth,
    });
    setPoint({
      ...point,
      x:
        ((e.clientX - rect.left) * canvasRef.current.width) / rect.width ||
        (e.touches &&
          e.touches[0].clientX -
            (rect.left * canvasRef.current.width) / rect.width),
      y:
        ((e.clientY - rect.top) * canvasRef.current.height) / rect.height ||
        (e.touches &&
          ((e.touches[0].e.clientY - rect.top) * canvasRef.current.height) /
            rect.height),
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
    const rect = canvasRef.current.getBoundingClientRect();
    if (!drawing) return;
    setDrawing(false);
    addLine({
      x0: x,
      y0: y,
      x1:
        ((e.clientX - rect.left) * canvasRef.current.width) / rect.width ||
        (e.touches &&
          e.touches[0].clientX -
            (rect.left * canvasRef.current.width) / rect.width),
      y1:
        ((e.clientY - rect.top) * canvasRef.current.height) / rect.height ||
        (e.touches &&
          ((e.touches[0].e.clientY - rect.top) * canvasRef.current.height) /
            rect.height),
      color,
      lineWidth,
    });
  };

  /**
   * Draws all the lines from Redux state lines
   */
  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    if (lines.length === 0) {
      context.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      context.beginPath();
    } else {
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
    }
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
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </>
  );
};

export default Canvas;
