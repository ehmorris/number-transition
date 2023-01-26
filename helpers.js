export const randomBetween = (min, max) => Math.random() * (max - min) + min;

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
  let startTime = Date.now();
  const getTimeElapsed = () => Date.now() - startTime;
  const resetStartTime = () => (startTime = Date.now());

  const drawFuncContainer = () => {
    drawFunc(getTimeElapsed, resetStartTime);
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
