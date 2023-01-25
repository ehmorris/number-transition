import { animate, generateCanvas } from "./helpers.js";
import { easeInOutSine } from "./easings.js";
import { mirroredLoopingProgress } from "./animation.js";
import { runPathPairs, tumblePathPairs, transitionPathPair } from "./paths.js";

const canvasWidth = 700;
const canvasHeight = 700;
const CTX = generateCanvas({
  width: canvasWidth,
  height: canvasHeight,
  attachNode: ".canvasContainer",
});

let activeSet = runPathPairs;
let runTransitionPhase1 = false;
let runTransitionPhase2 = false;
let transitionTargetSet = null;
let timeOffset = 0;
const transitionDuration = 400;

document
  .querySelector("button.activateTumble")
  .addEventListener("click", () => {
    if (
      activeSet !== tumblePathPairs &&
      !runTransitionPhase1 &&
      !runTransitionPhase2
    ) {
      transitionTargetSet = tumblePathPairs;
      runTransitionPhase1 = true;
    }
  });

document.querySelector("button.activateRun").addEventListener("click", () => {
  if (
    activeSet !== runPathPairs &&
    !runTransitionPhase1 &&
    !runTransitionPhase2
  ) {
    transitionTargetSet = runPathPairs;
    runTransitionPhase1 = true;
  }
});

animate((millisecondsElapsed) => {
  CTX.clearRect(0, 0, canvasWidth, canvasHeight);
  CTX.lineWidth = 10;
  CTX.lineCap = "round";
  let offsetMillisecondsElapsed = millisecondsElapsed - timeOffset;

  if (runTransitionPhase1) {
    // Create a new set that captures the current state of the active set as the
    // start of the animation. Set the end state to the beginning of the normal
    // loop that's targeted
    const newActiveSet = [];
    for (let flagellaIndex = 0; flagellaIndex < 6; flagellaIndex++) {
      newActiveSet.push({
        from: transitionPathPair(
          activeSet[flagellaIndex],
          mirroredLoopingProgress(
            0,
            activeSet[flagellaIndex].animationDuration,
            offsetMillisecondsElapsed
          ),
          easeInOutSine
        ),
        to: {
          path: transitionTargetSet[flagellaIndex].from.path,
          position: {
            x: transitionTargetSet[flagellaIndex].from.position.x,
            y: transitionTargetSet[flagellaIndex].from.position.y,
          },
        },
        animationDuration: transitionDuration,
        lightness: transitionTargetSet[flagellaIndex].lightness,
      });
    }

    activeSet = newActiveSet;
    timeOffset = millisecondsElapsed;
    offsetMillisecondsElapsed = 0;
    runTransitionPhase1 = false;
    runTransitionPhase2 = true;
  }

  if (runTransitionPhase2 && offsetMillisecondsElapsed >= transitionDuration) {
    activeSet = transitionTargetSet;
    timeOffset = millisecondsElapsed;
    offsetMillisecondsElapsed = 0;
    runTransitionPhase2 = false;
    transitionTargetSet = null;
  }

  for (let flagellaIndex = 0; flagellaIndex < 6; flagellaIndex++) {
    const pathAtPoint = transitionPathPair(
      activeSet[flagellaIndex],
      mirroredLoopingProgress(
        0,
        activeSet[flagellaIndex].animationDuration,
        offsetMillisecondsElapsed
      ),
      easeInOutSine
    );

    CTX.save();
    CTX.scale(0.5, 0.5);
    CTX.strokeStyle = `hsl(90, 18%, ${activeSet[flagellaIndex].lightness}%)`;
    CTX.translate(pathAtPoint.position.x, pathAtPoint.position.y);
    CTX.stroke(new Path2D(pathAtPoint.path));
    CTX.restore();
  }
});
