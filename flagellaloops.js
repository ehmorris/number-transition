import { animate, generateCanvas } from "./helpers.js";
import { easeInOutSine, easeInOutCubic } from "./easings.js";
import { mirroredLoopingProgress } from "./animation.js";
import { runPathPairs, tumblePathPairs, transitionPathPair } from "./paths.js";

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

  runPathPairs.forEach((pathPair) => {
    const pathAtPoint = transitionPathPair(
      pathPair,
      mirroredLoopingProgress(
        0,
        pathPair.animationDuration,
        millisecondsElapsed
      ),
      easeInOutSine
    );

    CTX.save();
    CTX.scale(0.5, 0.5);
    CTX.strokeStyle = `hsl(90, 18%, ${pathPair.lightness}%)`;
    CTX.translate(pathAtPoint.position.x, pathAtPoint.position.y - 200);
    CTX.stroke(new Path2D(pathAtPoint.path));
    CTX.restore();
  });

  tumblePathPairs.forEach((pathPair) => {
    const pathAtPoint = transitionPathPair(
      pathPair,
      mirroredLoopingProgress(
        0,
        pathPair.animationDuration,
        millisecondsElapsed
      ),
      easeInOutCubic
    );

    CTX.save();
    CTX.scale(0.5, 0.5);
    CTX.strokeStyle = `hsl(90, 18%, ${pathPair.lightness}%)`;
    CTX.translate(pathAtPoint.position.x + 800, pathAtPoint.position.y - 200);
    CTX.stroke(new Path2D(pathAtPoint.path));
    CTX.restore();
  });
});
