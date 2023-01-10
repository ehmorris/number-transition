import { animate, generateCanvas, textLayoutManager } from "./helpers.js";

const canvasWidth = 1000;
const canvasHeight = 1100;
const CTX = generateCanvas({
  width: canvasWidth,
  height: canvasHeight,
  attachNode: ".canvasContainer",
});

// Progress
// Transforms any number range into a range of 0–1
//
// Expected behavior:
// progress(5, 30, 17.5) = .5
// progress(30, 5, 17.5) = .5
// progress(5, 30, 30) = 1 etc.
const progress = (start, end, current) => (current - start) / (end - start);

const loopingProgress = (start, end, current) =>
  progress(start, end, current) % 1;

const mirroredLoopingProgress = (start, end, current) => {
  const progress = loopingProgress(start, end, current);
  return Math.floor(current / end) % 2 ? Math.abs(progress - 1) : progress;
};

// Easings
// Transforms linear progress into eased progress
const easeInOutQuad = (progress) =>
  progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

// Transition
// Transforms a range of 0–1 into any number range
//
// Expected behavior:
// transition(5, 30, .5) = 17.5
// transition(30, 5, .5) = 17.5
// transition(5, 30, 1) = 30
// transition(30, 5, 1) = 5
// transition(5, 30, 0) = 5
// transition(30, 5, 0) = 30
const transition = (start, end, progress, easingFunc) => {
  const easedProgress = easingFunc ? easingFunc(progress) : progress;
  return start + Math.sign(end - start) * Math.abs(end - start) * easedProgress;
};

// This will only work on two paths that have the same number of vertices
const transitionPath = (pathStart, pathEnd, progress, easingFunc) => {
  const splitPathIntoArray = (pathString) =>
    pathString
      .match(/[a-zA-Z]+|[0-9.]+/g)
      .map((n) => (parseFloat(n) ? parseFloat(n) : n));

  const startParts = splitPathIntoArray(pathStart);
  const endParts = splitPathIntoArray(pathEnd);
  let tweenParts = [];

  startParts.forEach((startPart, index) => {
    if (typeof startPart === "number") {
      tweenParts.push(
        transition(startPart, endParts[index], progress, easingFunc)
      );
    } else {
      tweenParts.push(startPart);
    }
  });

  return tweenParts.join(" ");
};

const draw = (ticksElapsed, startTime) => {
  CTX.clearRect(0, 0, canvasWidth, canvasHeight);
  const textLayout = textLayoutManager({ context: CTX, fontSize: 32 });
  const progress = mirroredLoopingProgress(0, 300, ticksElapsed);

  textLayout.renderText(`Ticks: ${ticksElapsed}`);

  textLayout.renderText(
    `Average FPS: ${Math.round(
      ticksElapsed / ((Date.now() - startTime) / 1000)
    )}`
  );

  textLayout.renderText(
    `Square loop: ${transition(32, 96, progress).toFixed(2)}`
  );

  CTX.fillRect(
    transition(32, 96, progress),
    textLayout.getLastTextYPos() + 16,
    16,
    16
  );

  textLayout.renderText(
    `Square loop with easing: ${transition(
      32,
      96,
      progress,
      easeInOutQuad
    ).toFixed(2)}`
  );

  CTX.fillRect(
    transition(32, 96, progress, easeInOutQuad),
    textLayout.getLastTextYPos() + 16,
    16,
    16
  );

  textLayout.renderText(
    `Looping path animation with easing: ${transition(
      0,
      1,
      progress,
      easeInOutQuad
    ).toFixed(2)}`
  );

  const pathStart =
    "M364.5 8.00009C343.5 0.166754 297 -1.29991 279 55.5001C256.5 126.5 276.5 335.5 229 476.5C181.5 617.5 178 843.5 3 951.5";
  const pathEnd =
    "M350.5 4.00024C307 4.00025 273.5 68 298 133C324.269 202.694 368.37 298.435 270.5 410.5C139.5 560.5 76 570.5 4.5 714";
  const pathTween = transitionPath(pathStart, pathEnd, progress, easeInOutQuad);

  CTX.save();
  CTX.translate(280, textLayout.getLastTextYPos() - 16);
  CTX.lineWidth = 10;
  CTX.lineCap = "round";
  CTX.stroke(new Path2D(pathTween));
  CTX.restore();
};

animate(draw);
