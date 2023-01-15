import { animate, generateCanvas, textLayoutManager } from "./helpers.js";
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

animate((ticksElapsed, startTime) => {
  CTX.clearRect(0, 0, canvasWidth, canvasHeight);
  const textLayout = textLayoutManager({ context: CTX, fontSize: 32 });
  const progress = mirroredLoopingProgress(0, 300, ticksElapsed);

  textLayout.newTextLine(`Ticks: ${ticksElapsed}`);

  textLayout.newTextLine(
    `Average FPS: ${Math.round(
      ticksElapsed / ((Date.now() - startTime) / 1000)
    )}`
  );

  textLayout.newTextLine(
    `Square loop (x: ${transition(32, 96, progress).toFixed(2)})`
  );

  CTX.fillRect(
    transition(32, 96, progress),
    textLayout.getLastTextYPos() + 16,
    16,
    16
  );

  textLayout.newTextLine(
    `Square loop with easing (x: ${transition(
      32,
      96,
      progress,
      easeInOutSine
    ).toFixed(2)})`
  );

  CTX.fillRect(
    transition(32, 96, progress, easeInOutSine),
    textLayout.getLastTextYPos() + 16,
    16,
    16
  );

  textLayout.newTextLine(
    `Looping path animation with easing (progress: ${transition(
      0,
      1,
      progress,
      easeInOutSine
    ).toFixed(2)})`
  );

  CTX.save();
  CTX.translate(32, textLayout.getLastTextYPos() + 16);
  CTX.scale(0.5, 0.5);
  CTX.lineWidth = 10;
  CTX.lineCap = "round";
  CTX.stroke(
    new Path2D(
      transitionPath(paths[0].start, paths[0].end, progress, easeInOutSine)
    )
  );
  CTX.restore();
});
