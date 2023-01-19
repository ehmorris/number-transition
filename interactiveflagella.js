import { animate, generateCanvas } from "./helpers.js";
import { easeInOutSine } from "./easings.js";
import {
  mirroredLoopingProgress,
  transition,
  transitionPath,
} from "./animation.js";
import { runPaths, tumblePaths } from "./paths.js";

const canvasWidth = 700;
const canvasHeight = 700;
const CTX = generateCanvas({
  width: canvasWidth,
  height: canvasHeight,
  attachNode: ".canvasContainer",
});

let activeSet = runPaths;
let transitionFlag = false;
let transitionTarget = null;
let timeOffset = 0;
const transitionDuration = 10_000;

document
  .querySelector("button.activateTumble")
  .addEventListener("click", () => {
    transitionTarget = tumblePaths;
    transitionFlag = true;
  });

document.querySelector("button.activateRun").addEventListener("click", () => {
  transitionTarget = runPaths;
  transitionFlag = true;
});

animate((millisecondsElapsed) => {
  CTX.clearRect(0, 0, canvasWidth, canvasHeight);

  CTX.lineWidth = 10;
  CTX.lineCap = "round";

  const offsetTimeElapsed = millisecondsElapsed - timeOffset;

  // In order to smoothly tween between the current state and the target state,
  // we have to freeze the current state and make that the `start`, with the
  // target state as the `end`. And afterwards begin looping normally again.
  if (transitionFlag) {
    const newActiveSet = [];
    for (let flagellaIndex = 0; flagellaIndex < 6; flagellaIndex++) {
      newActiveSet.push({
        start: transitionPath(
          activeSet[flagellaIndex].start,
          activeSet[flagellaIndex].end,
          mirroredLoopingProgress(
            0,
            activeSet[flagellaIndex].animationDuration,
            offsetTimeElapsed
          ),
          easeInOutSine
        ),
        end: transitionTarget[flagellaIndex].start,
        startPosition: {
          x: transition(
            activeSet[flagellaIndex].startPosition.x,
            activeSet[flagellaIndex].endPosition.x,
            mirroredLoopingProgress(
              0,
              activeSet[flagellaIndex].animationDuration,
              offsetTimeElapsed
            ),
            easeInOutSine
          ),
          y: transition(
            activeSet[flagellaIndex].startPosition.y,
            activeSet[flagellaIndex].endPosition.y,
            mirroredLoopingProgress(
              0,
              activeSet[flagellaIndex].animationDuration,
              offsetTimeElapsed
            ),
            easeInOutSine
          ),
        },
        endPosition: {
          x: transitionTarget[flagellaIndex].startPosition.x,
          y: transitionTarget[flagellaIndex].startPosition.y,
        },
        animationDuration: transitionDuration,
        lightness: transitionTarget[flagellaIndex].lightness,
      });
    }

    activeSet = newActiveSet;
    timeOffset = timeOffset + millisecondsElapsed;
    transitionFlag = false;

    // TODO: reset flags at end of transition duration (how to calculate, maybe
    // by using custom timing for this transition like 10_000)
    //
    // TODO: somehow inititate normal loop at end of transition duration
  }

  if (
    !transitionFlag &&
    transitionTarget &&
    offsetTimeElapsed >= transitionDuration
  ) {
    activeSet = transitionTarget;
    transitionTarget = null;
  }

  for (let flagellaIndex = 0; flagellaIndex < 6; flagellaIndex++) {
    CTX.save();
    CTX.scale(0.5, 0.5);
    CTX.strokeStyle = `hsl(90, 18%, ${activeSet[flagellaIndex].lightness}%)`;

    CTX.translate(
      transition(
        activeSet[flagellaIndex].startPosition.x,
        activeSet[flagellaIndex].endPosition.x,
        mirroredLoopingProgress(
          0,
          activeSet[flagellaIndex].animationDuration,
          offsetTimeElapsed
        ),
        easeInOutSine
      ),
      transition(
        activeSet[flagellaIndex].startPosition.y,
        activeSet[flagellaIndex].endPosition.y,
        mirroredLoopingProgress(
          0,
          activeSet[flagellaIndex].animationDuration,
          offsetTimeElapsed
        ),
        easeInOutSine
      )
    );
    CTX.stroke(
      new Path2D(
        transitionPath(
          activeSet[flagellaIndex].start,
          activeSet[flagellaIndex].end,
          mirroredLoopingProgress(
            0,
            activeSet[flagellaIndex].animationDuration,
            offsetTimeElapsed
          ),
          easeInOutSine
        )
      )
    );
    CTX.restore();
  }
});
