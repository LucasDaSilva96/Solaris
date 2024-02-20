"use strict";
import axios from "axios";
import { Toasts } from "./toast";

const BASE_URL = "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com";

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

// This function is in charge of getting the API-Key
const getApiKey = async () => {
  try {
    const { data } = await axios({
      method: "post",
      baseURL: BASE_URL,
      url: "/keys",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return data.key;
  } catch (error) {
    toasts.push({
      title: "Failed to fetch API key",
      content: error.message,
      style: "error",
      dismissAfter: "3s", // s = seconds
    });
  }
};

// This function is in charge of fetching the planets and return the result in form of an array with the Pluton planet in it
export const fetchPlanets = async () => {
  try {
    const KEY = await getApiKey();
    const { data } = await axios({
      method: "get",
      baseURL: BASE_URL,
      url: "/bodies",
      headers: {
        "x-zocom": KEY,
      },
    });

    return [
      ...data.bodies,
      {
        id: 9,
        circumference: 7445,
        desc: "Pluto it's about 3.6 billion miles away from the Sun, and it has a thin atmosphere composed mostly of nitrogen, methane, and carbon monoxide. On average, Pluto's temperature is -387°F (-232°C), making it too cold to sustain life. Pluto is orbited by five known moons, the largest of which is Charon.",
        distance: 3600000000,
        latinName: "Plūtō",
        moons: ["Charon", "Nix", "Hydra", "Kerberos", "Styx"],
        name: "Pluto",
        temp: { day: -147, night: -233 },
        type: "Dwarf planet",
        rotation: "",
      },
    ];
  } catch (error) {
    toasts.push({
      title: "Failed to fetch data",
      content: error.message,
      style: "error",
      dismissAfter: "3s", // s = seconds
    });
  }
};
