import { animate, generateCanvas, textLayoutManager } from "./helpers.js";
import { easeInOutSine } from "./easings.js";
import {
  mirroredLoopingProgress,
  transition,
  transitionPath,
} from "./animation.js";
import { path1, path2, path3, path4 } from "./paths.js";

const canvasWidth = 1000;
const canvasHeight = 1100;
const CTX = generateCanvas({
  width: canvasWidth,
  height: canvasHeight,
  attachNode: ".canvasContainer",
});

const translateOffset = (CTX, x, y) => {
  const offset = { x: 100, y: 0 };
  CTX.translate(offset.x + x, offset.y + y);
};

animate((ticksElapsed, startTime) => {
  CTX.clearRect(0, 0, canvasWidth, canvasHeight);
  const progress1 = mirroredLoopingProgress(0, 300, ticksElapsed);
  const progress2 = mirroredLoopingProgress(0, 400, ticksElapsed);
  const progress3 = mirroredLoopingProgress(0, 500, ticksElapsed);
  const progress4 = mirroredLoopingProgress(0, 380, ticksElapsed);

  CTX.lineWidth = 10;
  CTX.lineCap = "round";

  CTX.save();
  translateOffset(CTX, 0, 0);
  CTX.scale(0.5, 0.5);
  CTX.stroke(
    new Path2D(transitionPath(path1.start, path1.end, progress1, easeInOutSine))
  );
  CTX.restore();

  CTX.save();
  translateOffset(CTX, -35, 125.94);
  CTX.scale(0.5, 0.5);
  CTX.stroke(
    new Path2D(transitionPath(path2.start, path2.end, progress2, easeInOutSine))
  );
  CTX.restore();

  CTX.save();
  translateOffset(CTX, 11.38, 161.44);
  CTX.scale(0.5, 0.5);
  CTX.stroke(
    new Path2D(transitionPath(path3.start, path3.end, progress3, easeInOutSine))
  );
  CTX.restore();

  CTX.save();
  translateOffset(CTX, 1.5, 158.94);
  CTX.scale(0.5, 0.5);
  CTX.stroke(
    new Path2D(transitionPath(path4.start, path4.end, progress4, easeInOutSine))
  );
  CTX.restore();
});
