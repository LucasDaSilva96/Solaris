"use-strict";

import { fetchPlanets } from "./api";
import { applyOverlayContent } from "./overlay";
import { Toasts } from "./toast";

const main = document.querySelector("main");

// This is for the feedback/error if something goes wrong.
const toasts = new Toasts({
  offsetX: 20, // 20px
  offsetY: 20, // 20px
  gap: 20, // The gap size in pixels between toasts
  width: 300, // 300px
  timing: "ease", // See list of available CSS transition timings
  duration: ".5s", // Transition duration
  dimOld: true, // Dim old notifications while the newest notification stays highlighted
  position: "top-center", // top-left | top-center | top-right | bottom-left | bottom-center | bottom-right
});

// This function is for rendering all the planets in the main-section
export async function renderPlanets() {
  try {
    // The array with all the planets
    const array = await fetchPlanets();
    // The start content of the main-section
    main.innerHTML = `
     <article class="sun-wrapper">
        <div class="planet-container Solen"></div>
        <p>
          "Solen är stjärnan i solsystemet och det är runt den som de övriga
          delarna i solsystemet kretsar. Dess stora massa på 332 830 jordmassor
          ger den i dess innandöme en densitet som är hög nog för att
          upprätthålla fusion. Fusionen avger enorma mängder energi till rymden
          genom elektromagnetisk strålning, såsom synligt ljus."
        </p>
      </article>
    `;

    // Loop through the planets-array and render one by one
    array.map((planet) => {
      if (planet.name !== "Solen") {
        return (main.innerHTML += planetArticle(planet));
      }
    });
  } catch (error) {
    toasts.push({
      title: "Failed to render planets",
      content: error.message,
      style: "error",
      dismissAfter: "3s", // s = seconds
    });
  }
}

// This is a helper-function for rendering the planets with the right format
function planetArticle(planet) {
  return `
  <article class="planet__box">
          <div class="planet-container ${planet.name}"></div>
          <p class="desc">
            ${planet.desc}
          </p>
        </article>
  `;
}

// This function is in charge of rendering the overlay/side-page with the right planet-information when the user clicks on a planet in the main-section
export async function planetEventListener(e) {
  const planetName = e.target.classList[1];
  const planetsArray = await fetchPlanets();
  const planet = planetsArray.find((el) => el.name === planetName);
  applyOverlayContent(planet);
}
