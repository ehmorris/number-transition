import {
  animate,
  generateCanvas,
  textLayoutManager,
  randomBetween,
} from "./helpers.js";
import { easeInOutSine } from "./easings.js";
import {
  mirroredLoopingProgress,
  transition,
  transitionPath,
} from "./animation.js";
import { paths } from "./paths.js";

const canvasWidth = 1000;
const canvasHeight = 1100;
const CTX = generateCanvas({
  width: canvasWidth,
  height: canvasHeight,
  attachNode: ".canvasContainer",
});

const yOffset = -315;

animate((ticksElapsed, startTime) => {
  CTX.clearRect(0, 0, canvasWidth, canvasHeight);

  CTX.lineWidth = 10;
  CTX.lineCap = "round";

  paths.forEach((path) => {
    CTX.save();
    CTX.scale(0.5, 0.5);
    CTX.strokeStyle = `rgba(0, 0, 0, ${path.opacity})`;

    CTX.translate(
      transition(
        path.startPosition.x,
        path.endPosition.x,
        mirroredLoopingProgress(0, path.animationDuration, ticksElapsed),
        easeInOutSine
      ),
      transition(
        path.startPosition.y + yOffset,
        path.endPosition.y + yOffset,
        mirroredLoopingProgress(0, path.animationDuration, ticksElapsed),
        easeInOutSine
      )
    );
    CTX.stroke(
      new Path2D(
        transitionPath(
          path.start,
          path.end,
          mirroredLoopingProgress(0, path.animationDuration, ticksElapsed),
          easeInOutSine
        )
      )
    );
    CTX.restore();
  });
});
