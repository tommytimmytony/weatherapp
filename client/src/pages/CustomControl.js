import Control from "ol/control/Control";

export default class CustomControl extends Control {
  constructor(options = {}) {
    const { onClick, positionStyles = {} } = options;

    // Create the control container and apply positioning styles
    const element = document.createElement("div");
    element.className = "ol-unselectable ol-control";
    Object.assign(element.style, {
      position: "absolute",
      ...positionStyles, // Apply custom positioning from options
    });

    // Create a button for the custom controller
    const button = document.createElement("button");
    button.innerHTML = options.label || "Custom";
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener("click", () => {
      if (options.onClick) options.onClick();
    });
  }
}
