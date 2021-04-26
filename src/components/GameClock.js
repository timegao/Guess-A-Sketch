import { useSelector } from "react-redux";
import { getGameClock, getGameState } from "../redux/game";
import { DURATION, GAME_STATE } from "../redux/stateConstants";
import { getUsers } from "../redux/users";
import { useEffect, useState } from "react";

// https://codepen.io/FlorinPop17/pen/YbpwyG
const convertToSeconds = (milliseconds) =>
  milliseconds === Infinity ? 0 : milliseconds / 1000;

const SVGCircle = ({ radius }) => (
  <svg className="countdown-svg">
    <path
      fill="none"
      stroke="#333"
      strokeWidth="4"
      d={describeArc(50, 50, 30, 0, radius)}
    />
  </svg>
);

// From stackoverflow: https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {
  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);

  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  var d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");

  return d;
}

// Stackoverflow: https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers
function mapNumber(number, in_min, in_max, out_min, out_max) {
  return (
    ((number - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
  );
}

const determineMaxSecondsForGameState = (gameState) => {
  switch (gameState) {
    case GAME_STATE.TURN_START:
      return convertToSeconds(DURATION.TURN_START);
    case GAME_STATE.TURN_DURING:
      return convertToSeconds(DURATION.TURN_DURING);
    case GAME_STATE.TURN_END:
      return convertToSeconds(DURATION.TURN_END);
    case GAME_STATE.GAME_OVER:
      return convertToSeconds(DURATION.GAME_OVER);
    default:
      // GAME_STATE.WAITING or other
      return 0; // no arc will render
  }
};

const GameClock = () => {
  const time = useSelector(getGameClock);
  const gameState = useSelector(getGameState);
  const [secondsRadius, setSecondsRadius] = useState(0);

  useEffect(() => {
    if (time >= 0) {
      setSecondsRadius(
        mapNumber(
          convertToSeconds(time),
          determineMaxSecondsForGameState(gameState),
          0,
          0,
          360
        )
      );
    }
  }, [gameState, time]);

  return (
    <div className="countdown-wrapper">
      <div className="countdown-item">
        <SVGCircle radius={secondsRadius} />
        {convertToSeconds(time)}
        <span>sec</span>
      </div>
    </div>
  );
};

export default GameClock;
