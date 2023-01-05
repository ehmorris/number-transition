const generateCanvas = ({ width, height, attachNode }) => {
  const element = document.createElement("canvas");
  const context = element.getContext("2d");

  element.style.width = width + "px";
  element.style.height = height + "px";

  const scale = window.devicePixelRatio;
  element.width = Math.floor(width * scale);
  element.height = Math.floor(height * scale);
  context.scale(scale, scale);

  document.querySelector(attachNode).appendChild(element);

  return context;
};

const width = 800;
const height = 500;

const CTX = generateCanvas({
  width,
  height,
  attachNode: ".canvasContainer",
});

// Outputs a number between 0 and 1 that represents where the current number is
// between the start and end inputs
//
// Expected behavior:
// progress(5, 30, 17.5) = .5
// progress(30, 5, 17.5) = .5
// progress(5, 30, 30) = 1 etc.
const linearProgress = (start, end, current) =>
  Math.min(Math.max(Math.abs(current - start) / Math.abs(end - start), 0), 1);

// Converts linearProgress into an eased progress
// The bounds of 0 (beginning of the animation) and 1 (end of animation)
// are hardcoded
const  easeOutQuart = x =>
  1 - Math.pow(1 - x, 4);

// Outputs a number between the start and end number as defined by progress
//
// Expected behavior:
// transition(5, 30, .5) = 17.5
// transition(30, 5, .5) = 17.5
// transition(5, 30, 1) = 30
// transition(30, 5, 1) = 5
// transition(5, 30, 0) = 5
// transition(30, 5, 0) = 30
const transition = (start, end, progress) =>
  start + Math.sign(end - start) * Math.abs(end - start) * progress;

let ticks = 0;
const drawFrame = () => {
  CTX.clearRect(0, 0, width, height);

  const tickProgress = easeOutQuart(linearProgress(0, 2000, ticks));
  const text = Math.trunc(transition(130, 70, tickProgress));

  CTX.font = "48px sans-serif";
  CTX.fillText(`transition between 130 and 70: ${text}`, 10, 50);

  CTX.font = "12px sans-serif";
  CTX.fillText(`between ticks 0 and 2000: ${ticks}`, 10, 70);

  ticks++;
  window.requestAnimationFrame(drawFrame);
};

window.requestAnimationFrame(drawFrame);
