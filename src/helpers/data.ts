import ferrariImg from "../assets/ferrari.jpg";
import turtleImg from "../assets/turtle.jpg";
import cheetahImg from "../assets/cheetah.jpg";
import regularImg from "../assets/regular.jpg";
import rocketImg from "../assets/rocket.jpg";

export const initialSnakeDots = [
  [0, 0],
  [30, 0],
  [60, 0],
  [90, 0],
  [120, 0],
  [150, 0],
];
export const speedChoices = [
  { name: "TURTLE 🐢", speed: 400 },
  { name: "REGULAR 🥱", speed: 250 },
  { name: "CHEETAH 🐆", speed: 100 },
  { name: "FERRARI 🏎️", speed: 50 },
  { name: "SPACESHIP 🚀", speed: 25 },
];

export const imageSources = [
  turtleImg,
  regularImg,
  cheetahImg,
  ferrariImg,
  rocketImg,
];
