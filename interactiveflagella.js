import { generateCanvas } from "./_helpers.js";
import { easeInOutSine } from "./_easings.js";
import { mirroredLoopingProgress, animate } from "./_animation.js";
import { runPathPairs, tumblePathPairs, transitionPathPair } from "./_paths.js";

const canvasWidth = 700;
const canvasHeight = 700;
const CTX = generateCanvas({
  width: canvasWidth,
  height: canvasHeight,
  attachNode: ".canvasContainer",
});

const state = new Map()
  .set("activeSet", runPathPairs)
  .set("transitionPhase", 0)
  .set("transitionTargetSet", null);

document
  .querySelector("button.activateTumble")
  .addEventListener("click", () => {
    if (
      state.get("activeSet") !== tumblePathPairs &&
      state.get("transitionPhase") === 0
    ) {
      state
        .set("transitionTargetSet", tumblePathPairs)
        .set("transitionPhase", 1);
    }
  });

document.querySelector("button.activateRun").addEventListener("click", () => {
  if (
    state.get("activeSet") !== runPathPairs &&
    state.get("transitionPhase") === 0
  ) {
    state.set("transitionTargetSet", runPathPairs).set("transitionPhase", 1);
  }
});

animate((millisecondsElapsed, resetElapsedTime) => {
  CTX.clearRect(0, 0, canvasWidth, canvasHeight);
  CTX.lineWidth = 10;
  CTX.lineCap = "round";
  const transitionDuration = 400;

  if (state.get("transitionPhase") === 1) {
    // Create a new set that captures the current state of the active set as the
    // start of the animation. Set the end state to the beginning of the normal
    // loop that's targeted
    const newActiveSet = [];
    for (let flagellaIndex = 0; flagellaIndex < 6; flagellaIndex++) {
      newActiveSet.push({
        from: transitionPathPair(
          state.get("activeSet")[flagellaIndex],
          mirroredLoopingProgress(
            0,
            state.get("activeSet")[flagellaIndex].animationDuration,
            millisecondsElapsed()
          ),
          easeInOutSine
        ),
        to: {
          path: state.get("transitionTargetSet")[flagellaIndex].from.path,
          position: {
            x: state.get("transitionTargetSet")[flagellaIndex].from.position.x,
            y: state.get("transitionTargetSet")[flagellaIndex].from.position.y,
          },
        },
        animationDuration: transitionDuration,
        lightness: state.get("transitionTargetSet")[flagellaIndex].lightness,
      });
    }

    state.set("activeSet", newActiveSet).set("transitionPhase", 2);
    resetElapsedTime();
  }

  if (
    state.get("transitionPhase") === 2 &&
    millisecondsElapsed() >= transitionDuration
  ) {
    state
      .set("activeSet", state.get("transitionTargetSet"))
      .set("transitionPhase", 0);
    resetElapsedTime();
  }

  for (let flagellaIndex = 0; flagellaIndex < 6; flagellaIndex++) {
    const pathAtPoint = transitionPathPair(
      state.get("activeSet")[flagellaIndex],
      mirroredLoopingProgress(
        0,
        state.get("activeSet")[flagellaIndex].animationDuration,
        millisecondsElapsed()
      ),
      easeInOutSine
    );

    CTX.save();
    CTX.scale(0.5, 0.5);
    CTX.strokeStyle = `hsl(90, 18%, ${
      state.get("activeSet")[flagellaIndex].lightness
    }%)`;
    CTX.translate(pathAtPoint.position.x, pathAtPoint.position.y);
    CTX.stroke(new Path2D(pathAtPoint.path));
    CTX.restore();
  }
});
