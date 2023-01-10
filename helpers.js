export const generateCanvas = ({ width, height, attachNode }) => {
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

export const animate = (drawFunc) => {
  let ticks = 0;
  const startTime = Date.now();

  const drawFuncContainer = () => {
    drawFunc(ticks, startTime);
    ticks++;
    window.requestAnimationFrame(drawFuncContainer);
  };

  window.requestAnimationFrame(drawFuncContainer);
};

export const textLayoutManager = ({ context, fontSize }) => {
  let lines = 0;
  context.font = `${fontSize}px sans-serif`;

  const newTextLine = (text) => {
    lines++;
    context.fillText(text, 32, lines * (fontSize + fontSize));
  };

  const getLastTextYPos = () => lines * (fontSize + fontSize);

  return { newTextLine, getLastTextYPos };
};

export const easeInOutQuad = (progress) =>
  progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
