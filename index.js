import { animate, generateCanvas } from "./helpers.js";

const canvasWidth = 1000;
const canvasHeight = 1100;
const CTX = generateCanvas({
  width: canvasWidth,
  height: canvasHeight,
  attachNode: ".canvasContainer",
});

// Outputs a number between 0 and 1 that represents where the current number is
// between the start and end inputs
//
// Expected behavior:
// progress(5, 30, 17.5) = .5
// progress(30, 5, 17.5) = .5
// progress(5, 30, 30) = 1 etc.
const linearProgress = (start, end, current) =>
  Math.min(Math.max(Math.abs(current - start) / Math.abs(end - start), 0), 1);

// Converts linearProgress into an eased progress
// The bounds of 0 (beginning of the animation) and 1 (end of animation)
// are hardcoded
const easeOutQuart = (x) => 1 - Math.pow(1 - x, 4);

// Outputs a number between the start and end number as defined by progress
//
// Expected behavior:
// transition(5, 30, .5) = 17.5
// transition(30, 5, .5) = 17.5
// transition(5, 30, 1) = 30
// transition(30, 5, 1) = 5
// transition(5, 30, 0) = 5
// transition(30, 5, 0) = 30
const transition = (start, end, progress) =>
  start + Math.sign(end - start) * Math.abs(end - start) * progress;

const splitPathIntoArray = (pathString) =>
  pathString
    .match(/[a-zA-Z]+|[0-9.]+/g)
    .map((n) => (parseFloat(n) ? parseFloat(n) : n));

const combineArrayIntoPath = (pathArray) => pathArray.join(" ");

// This will only work on two paths that have the same number of vertices
const transitionPath = (pathStart, pathEnd, progress) => {
  const startParts = splitPathIntoArray(pathStart);
  const endParts = splitPathIntoArray(pathEnd);
  let tweenParts = [];

  startParts.forEach((startPart, index) => {
    if (typeof startPart === "number") {
      tweenParts.push(transition(startPart, endParts[index], progress));
    } else {
      tweenParts.push(startPart);
    }
  });

  return combineArrayIntoPath(tweenParts);
};

const draw = (ticks) => {
  CTX.clearRect(0, 0, canvasWidth, canvasHeight);

  const tickProgress = easeOutQuart(linearProgress(0, 2000, ticks));
  const animatedNumber = transition(130, 70, tickProgress).toFixed(1);
  CTX.font = "48px sans-serif";
  CTX.fillText(`transition between 130 and 70: ${animatedNumber}`, 10, 50);

  CTX.font = "12px sans-serif";
  CTX.fillText(`between ticks 0 and 2000: ${ticks}`, 10, 70);

  const pathStart =
    "M364.5 8.00009C343.5 0.166754 297 -1.29991 279 55.5001C256.5 126.5 276.5 335.5 229 476.5C181.5 617.5 178 843.5 3 951.5";
  const pathEnd =
    "M350.5 4.00024C307 4.00025 273.5 68 298 133C324.269 202.694 368.37 298.435 270.5 410.5C139.5 560.5 76 570.5 4.5 714";
  const pathTween = transitionPath(pathStart, pathEnd, tickProgress);

  CTX.save();
  CTX.translate(280, 60);
  CTX.lineWidth = 10;
  CTX.lineCap = "round";
  CTX.stroke(new Path2D(pathTween));
  CTX.restore();
};

animate(draw);
