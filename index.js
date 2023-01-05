import { animate, generateCanvas } from "./helpers.js";

const canvasWidth = 1000;
const canvasHeight = 500;
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

const draw = (ticks) => {
  const tickProgress = easeOutQuart(linearProgress(0, 2000, ticks));
  const animatedNumber = transition(130, 70, tickProgress).toFixed(1);

  CTX.clearRect(0, 0, canvasWidth, canvasHeight);
  CTX.font = "48px sans-serif";
  CTX.fillText(`transition between 130 and 70: ${animatedNumber}`, 10, 50);
  CTX.font = "12px sans-serif";
  CTX.fillText(`between ticks 0 and 2000: ${ticks}`, 10, 70);
};

animate(draw);
