import { animate, generateCanvas } from "./helpers.js";
import { easeInOutSine, easeInOutCubic } from "./easings.js";
import {
  mirroredLoopingProgress,
  transition,
  transitionPath,
} from "./animation.js";
import { runPaths, tumblePaths } from "./paths.js";

const canvasWidth = 1000;
const canvasHeight = 700;
const CTX = generateCanvas({
  width: canvasWidth,
  height: canvasHeight,
  attachNode: ".canvasContainer",
});

animate((millisecondsElapsed) => {
  CTX.clearRect(0, 0, canvasWidth, canvasHeight);

  CTX.lineWidth = 10;
  CTX.lineCap = "round";

  // Reverse so the first paths are drawn on top of the others
  [...runPaths].reverse().forEach((path) => {
    CTX.save();
    CTX.scale(0.5, 0.5);
    CTX.strokeStyle = `hsl(90, 18%, ${path.lightness}%)`;
    const yOffset = -200;

    CTX.translate(
      transition(
        path.startPosition.x,
        path.endPosition.x,
        mirroredLoopingProgress(0, path.animationDuration, millisecondsElapsed),
        easeInOutSine
      ),
      transition(
        path.startPosition.y + yOffset,
        path.endPosition.y + yOffset,
        mirroredLoopingProgress(0, path.animationDuration, millisecondsElapsed),
        easeInOutSine
      )
    );
    CTX.stroke(
      new Path2D(
        transitionPath(
          path.start,
          path.end,
          mirroredLoopingProgress(
            0,
            path.animationDuration,
            millisecondsElapsed
          ),
          easeInOutSine
        )
      )
    );
    CTX.restore();
  });

  // Reverse so the first paths are drawn on top of the others
  [...tumblePaths].reverse().forEach((path) => {
    CTX.save();
    CTX.scale(0.5, 0.5);
    CTX.strokeStyle = `hsl(90, 18%, ${path.lightness}%)`;
    const xOffset = 800;
    const yOffset = -200;

    CTX.translate(
      transition(
        path.startPosition.x + xOffset,
        path.endPosition.x + xOffset,
        mirroredLoopingProgress(0, path.animationDuration, millisecondsElapsed),
        easeInOutCubic
      ),
      transition(
        path.startPosition.y + yOffset,
        path.endPosition.y + yOffset,
        mirroredLoopingProgress(0, path.animationDuration, millisecondsElapsed),
        easeInOutCubic
      )
    );
    CTX.stroke(
      new Path2D(
        transitionPath(
          path.start,
          path.end,
          mirroredLoopingProgress(
            0,
            path.animationDuration,
            millisecondsElapsed
          ),
          easeInOutCubic
        )
      )
    );
    CTX.restore();
  });
});
