import { getIndex } from "./nasa_api";
import ColorThief from "colorthief";
import "./style.scss";
import { down, left, right, up } from "./icons";

const colorThief = new ColorThief();

const display = document.getElementById("display") as HTMLDivElement;

const image = document.createElement("img");

image.crossOrigin = "Anonymous";

let currentLoader = document.getElementsByClassName("loader")[0];

const getLoader = () => {
  const elem = document.createElement("div");
  elem.classList.add("loader");
};

const setHeight = () => {
  image.setAttribute("height", `${window.innerHeight}px`);
};

window.addEventListener("resize", setHeight);

setHeight();

display.appendChild(image);

const setImage = (blob: Blob) => {
  if (currentLoader) {
    currentLoader.remove();
  }
  const src = window.URL.createObjectURL(blob);
  image.setAttribute("src", src);
  image.addEventListener("load", () => {
    image.setAttribute("width", `${image.offsetWidth}px`);
    const color = colorThief.getColor(image);
    image.removeAttribute("width");
    display.style.backgroundColor = `rgb(${color.join(",")})`;
  });
};
getIndex(1).then(({ data }) => {
  setImage(data.blob);
});

let containerCurrentPosition: {
  x: "right" | "left";
  y: "bottom" | "top";
} | null = null;

const container = document.getElementsByClassName(
  "container"
)[0] as HTMLDivElement;

const animateContainer = (
  action: "up" | "right" | "left" | "down",
  anim?: boolean,
  speed: number = 4
) => {
  let interval: number;
  const clear = () => {
    clearInterval(interval);
  };

  switch (action) {
    case "up": {
      let end = 120;
      if (anim) {
        interval = setInterval(() => {
          container.style.marginTop = `${
            parseInt(
              container.style.marginTop.slice(0, 3) ||
                `${window.innerHeight - 121}`
            ) -
            1 * speed
          }px`;
          if (parseInt(container.style.marginTop?.slice(0, 3)) <= end) {
            clear();
          }
        }, 1);
      } else {
        container.style.marginTop = `${end}px`;
      }
      break;
    }
    case "down": {
      let end = window.innerHeight - 240;
      if (anim) {
        interval = setInterval(() => {
          container.style.marginTop = `${
            parseInt(container.style.marginTop.slice(0, 3) || `${239}`) +
            1 * speed
          }px`;
          if (parseInt(container.style.marginTop?.slice(0, 3)) >= end) {
            clear();
          }
        }, 1);
      } else {
        container.style.marginTop = `${end}px`;
      }
      break;
    }
    case "left": {
      let end = 100;
      if (anim) {
        interval = setInterval(() => {
          container.style.marginLeft = `${
            parseInt(
              container.style.marginLeft.slice(0, 3) ||
                `${window.innerWidth - 790}`
            ) -
            1 * speed
          }px`;
          if (parseInt(container.style.marginLeft?.slice(0, 3)) <= end) {
            clear();
          }
        }, 1);
      } else {
        container.style.marginLeft = `${end}px`;
      }
      break;
    }
    case "right": {
      let end = window.innerWidth - 790;
      if (anim) {
        interval = setInterval(() => {
          container.style.marginLeft = `${
            parseInt(container.style.marginLeft.slice(0, 3) || `${99}`) +
            1 * speed
          }px`;
          if (parseInt(container.style.marginLeft?.slice(0, 3)) >= end) {
            clear();
          }
        }, 1);
      } else {
        container.style.marginLeft = `${end}px`;
      }
      break;
    }
  }
};

const updateContainerPosition = (x: "right" | "left", y: "top" | "bottom") => {
  const prev = containerCurrentPosition || { x, y };
  containerCurrentPosition = { x, y };
  const bar = document.getElementById(y === "top" ? "arrow-down" : "arrow-top");
  const toDisplay: HTMLDivElement[] = [];

  const removeAll = () => {
    toDisplay.forEach((x) => x.remove());
    container.classList.remove(x, y);
  };

  switch (y) {
    case "bottom": {
      animateContainer("down", prev.y !== "bottom");
      const arrow = document.createElement("div");
      arrow.addEventListener("click", () => {
        removeAll();
        updateContainerPosition(x, "top");
      });
      arrow.innerHTML = up.html[0];
      toDisplay.push(arrow);
      break;
    }
    case "top": {
      // container.classList.add("top");
      animateContainer("up", prev.y !== "top");
      const arrow = document.createElement("div");
      arrow.addEventListener("click", () => {
        removeAll();
        updateContainerPosition(x, "bottom");
      });
      arrow.innerHTML = down.html[0];
      toDisplay.push(arrow);
      break;
    }
  }

  switch (x) {
    case "left": {
      animateContainer("left", prev.x !== "left");
      const arrow = document.createElement("div");
      arrow.addEventListener("click", () => {
        removeAll();
        updateContainerPosition("right", y);
      });
      arrow.innerHTML = right.html[0];
      toDisplay.push(arrow);
      break;
    }
    case "right": {
      animateContainer("right", prev.x !== "right");
      const arrow = document.createElement("div");
      arrow.addEventListener("click", () => {
        removeAll();
        updateContainerPosition("left", y);
      });
      arrow.innerHTML = left.html[0];
      toDisplay.push(arrow);
      break;
    }
  }

  if (x === "right") {
    toDisplay.reverse();
  }

  bar?.setAttribute("style", `margin-${x}: auto`);

  toDisplay.forEach((elem) => {
    bar?.appendChild(elem);
  });
};

updateContainerPosition("left", "bottom");
