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

  runPaths.forEach((pathPair) => {
    CTX.save();
    CTX.scale(0.5, 0.5);
    CTX.strokeStyle = `hsl(90, 18%, ${pathPair.lightness}%)`;
    const yOffset = -200;

    CTX.translate(
      transition(
        pathPair.from.position.x,
        pathPair.to.position.x,
        mirroredLoopingProgress(
          0,
          pathPair.animationDuration,
          millisecondsElapsed
        ),
        easeInOutSine
      ),
      transition(
        pathPair.from.position.y + yOffset,
        pathPair.to.position.y + yOffset,
        mirroredLoopingProgress(
          0,
          pathPair.animationDuration,
          millisecondsElapsed
        ),
        easeInOutSine
      )
    );
    CTX.stroke(
      new Path2D(
        transitionPath(
          pathPair.from.path,
          pathPair.to.path,
          mirroredLoopingProgress(
            0,
            pathPair.animationDuration,
            millisecondsElapsed
          ),
          easeInOutSine
        )
      )
    );
    CTX.restore();
  });

  tumblePaths.forEach((pathPair) => {
    CTX.save();
    CTX.scale(0.5, 0.5);
    CTX.strokeStyle = `hsl(90, 18%, ${pathPair.lightness}%)`;
    const xOffset = 800;
    const yOffset = -200;

    CTX.translate(
      transition(
        pathPair.from.position.x + xOffset,
        pathPair.to.position.x + xOffset,
        mirroredLoopingProgress(
          0,
          pathPair.animationDuration,
          millisecondsElapsed
        ),
        easeInOutCubic
      ),
      transition(
        pathPair.from.position.y + yOffset,
        pathPair.to.position.y + yOffset,
        mirroredLoopingProgress(
          0,
          pathPair.animationDuration,
          millisecondsElapsed
        ),
        easeInOutCubic
      )
    );
    CTX.stroke(
      new Path2D(
        transitionPath(
          pathPair.from.path,
          pathPair.to.path,
          mirroredLoopingProgress(
            0,
            pathPair.animationDuration,
            millisecondsElapsed
          ),
          easeInOutCubic
        )
      )
    );
    CTX.restore();
  });
});
