import { animate, generateCanvas } from "./helpers.js";
import { easeInOutSine, easeInOutCubic } from "./easings.js";
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

document
  .querySelector("button.activateTumble")
  .addEventListener("click", () => {
    activeSet = tumblePaths;
  });

document.querySelector("button.activateRun").addEventListener("click", () => {
  activeSet = runPaths;
});

animate((millisecondsElapsed) => {
  CTX.clearRect(0, 0, canvasWidth, canvasHeight);

  CTX.lineWidth = 10;
  CTX.lineCap = "round";

  for (let flagellaIndex = 0; flagellaIndex < 6; flagellaIndex++) {
    CTX.save();
    CTX.scale(0.5, 0.5);
    CTX.strokeStyle = `hsl(90, 18%, ${activeSet[flagellaIndex].lightness}%)`;
    const yOffset = -200;

    CTX.translate(
      transition(
        activeSet[flagellaIndex].startPosition.x,
        activeSet[flagellaIndex].endPosition.x,
        mirroredLoopingProgress(
          0,
          activeSet[flagellaIndex].animationDuration,
          millisecondsElapsed
        ),
        easeInOutSine
      ),
      transition(
        activeSet[flagellaIndex].startPosition.y + yOffset,
        activeSet[flagellaIndex].endPosition.y + yOffset,
        mirroredLoopingProgress(
          0,
          activeSet[flagellaIndex].animationDuration,
          millisecondsElapsed
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
            millisecondsElapsed
          ),
          easeInOutSine
        )
      )
    );
    CTX.restore();
  }
});
