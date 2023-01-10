import { animate, generateCanvas, textLayoutManager } from "./helpers.js";

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
  (current - start) / (end - start);

// Converts linearProgress into an eased progress
// The bounds of 0 (beginning of the animation) and 1 (end of animation)
// are hardcoded
const easeOutQuart = (x) => 1 - Math.pow(1 - x, 4);

const reverseProgress = (progress) => -1 * (progress - 1);

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

const draw = (ticksElapsed) => {
  CTX.clearRect(0, 0, canvasWidth, canvasHeight);

  const animationDurationInTicks = 500;
  const tickProgress = linearProgress(
    0,
    animationDurationInTicks,
    ticksElapsed
  );
  const textLayout = textLayoutManager({ context: CTX, fontSize: 32 });

  textLayout.renderText(`Ticks: ${ticksElapsed}`);

  const animatedNumber = transition(130, 70, tickProgress).toFixed(1);
  textLayout.renderText(
    `Transition from 130–70 in ${animationDurationInTicks} ticks: ${animatedNumber}`
  );

  const loopingTickProgress = tickProgress % 1;
  const isProgressIncreasing =
    Math.floor(ticksElapsed / animationDurationInTicks) % 2 === 0;
  const mirroredLoopingProgress = isProgressIncreasing
    ? loopingTickProgress
    : reverseProgress(loopingTickProgress);

  textLayout.renderText(
    `Mirrored loop progress: ${mirroredLoopingProgress.toFixed(2)}`
  );

  const pathStart =
    "M364.5 8.00009C343.5 0.166754 297 -1.29991 279 55.5001C256.5 126.5 276.5 335.5 229 476.5C181.5 617.5 178 843.5 3 951.5";
  const pathEnd =
    "M350.5 4.00024C307 4.00025 273.5 68 298 133C324.269 202.694 368.37 298.435 270.5 410.5C139.5 560.5 76 570.5 4.5 714";
  const pathTween = transitionPath(pathStart, pathEnd, mirroredLoopingProgress);

  CTX.save();
  CTX.translate(280, textLayout.getLineYPos(3) - 16);
  CTX.lineWidth = 10;
  CTX.lineCap = "round";
  CTX.stroke(new Path2D(pathTween));
  CTX.restore();

  textLayout.renderText(
    `Square X position animated with mirrored loop: ${mirroredLoopingProgress.toFixed(
      2
    )}`
  );

  CTX.fillRect(
    transition(32, 96, mirroredLoopingProgress),
    textLayout.getLineYPos(4) + 16,
    32,
    32
  );
};

animate(draw);
