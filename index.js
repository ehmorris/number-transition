import { generateCanvas, textLayoutManager } from "./helpers.js";
import { easeInOutSine } from "./easings.js";
import {
  mirroredLoopingProgress,
  transition,
  transitionPath,
  animate,
} from "./animation.js";

const canvasWidth = 1000;
const canvasHeight = 1100;
const CTX = generateCanvas({
  width: canvasWidth,
  height: canvasHeight,
  attachNode: ".canvasContainer",
});

animate((millisecondsElapsed) => {
  CTX.clearRect(0, 0, canvasWidth, canvasHeight);
  const textLayout = textLayoutManager({ context: CTX, fontSize: 32 });
  const progress = mirroredLoopingProgress(0, 5_000, millisecondsElapsed());

  textLayout.newTextLine(`Milliseconds: ${millisecondsElapsed()}`);

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
  CTX.lineWidth = 8;
  CTX.lineCap = "round";
  CTX.stroke(
    new Path2D(
      transitionPath(
        "M11.5 12.9999C83.5 7.99995 70 17.5 55.5 75C46.8216 109.414 89.5 102 123.5 110.5C157.5 119 165 131.5 171 172.5",
        "M11.5 13C11.5 52 105.987 13 120 48.5C127.5 67.5 93.5 94.5 102.5 128.5C111.5 162.5 132.5 172.5 171 172.5",
        progress,
        easeInOutSine
      )
    )
  );
  CTX.restore();
});
