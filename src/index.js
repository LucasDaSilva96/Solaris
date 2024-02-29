"use strict";
import "./style.css";
import { applyOverlayContent, toggleOverlay } from "./overlay";
import { planetEventListener, renderPlanets } from "./renderplanets";
import { autocomplete, checkPlanetName } from "./search";
import { Toasts } from "./toast";

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

// DOM - selections
const input = document.querySelector("input");
const close__btn = document.querySelector(".close__btn__box");
const search__btn = document.querySelector(".icon");

// This is for rendering all planets when the page is loaded, and for making the planets clickable.
window.addEventListener("DOMContentLoaded", async () => {
  await renderPlanets();
  const allPlanets = document.querySelectorAll(".planet-container");

  allPlanets.forEach((planet) => {
    planet.addEventListener("click", planetEventListener);
  });
});

// This is for closing the overlay/side-page when the user clicks on the X - icon
close__btn.addEventListener("click", toggleOverlay);

// This is for the autocomplete search of the planets
autocomplete(input);

// This is for the search-logic that allows users to go to the overlay/side-page with the correct planet-data
search__btn.addEventListener("click", async () => {
  const hasPlanet = await checkPlanetName(input.value);

  if (!hasPlanet.hasPlanet) {
    toasts.push({
      title: "No planet found",
      content: "Please enter a valid planet name",
      style: "error",
      dismissAfter: "3s", // s = seconds
    });
  }
  if (hasPlanet.hasPlanet) {
    applyOverlayContent(hasPlanet.planetFound);
    input.textContent = "";
    input.value = "";
  }
});
