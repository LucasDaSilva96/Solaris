"use-strict";

// DOM - selections
const overlay = document.getElementById("overlay");
const planet__container = document.querySelector(".overlay-planet-container");
const planet__content__h1 = document.querySelector(".overlay__content__h1");
const planet__content__h2 = document.querySelector(".overlay__content__h2");
const planet__content__p = document.querySelector(".overlay__content__p");
const planet__size = document.getElementById("planet__size");
const planet__distance = document.getElementById("planet__distance");
const planet__max__temp = document.getElementById("planet__max--temp");
const planet__min__temp = document.getElementById("planet__min--temp");
const planet__moons = document.getElementById("planet__moons");

// This function is for toggling the overlay/side-page
export const toggleOverlay = () => {
  overlay.classList.toggle("slide");
};

// This function is for applying the content of the overlay/side-page with the right content based on the planet
export function applyOverlayContent(planet) {
  planet__container.classList = "overlay-planet-container";

  planet__container.classList.add(`${planet.name}`);
  planet__content__h1.textContent = planet.name;
  planet__content__h2.textContent = planet.latinName;
  planet__content__p.textContent = planet.desc;
  planet__size.textContent = planet.circumference + " Km";
  planet__distance.textContent = planet.distance + " Km";
  planet__max__temp.textContent = planet.temp.day + "ºC";
  planet__min__temp.textContent = planet.temp.night + "ºC";
  planet__moons.textContent = planet.moons.map((el) => `${el} `);
  toggleOverlay();
}
