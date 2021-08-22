import React, { KeyboardEvent } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { ReactElement } from "react";
import "./App.css";
import sarah from "./sarah.png";
import ferrariImg from "./assets/ferrari.jpg";
import turtleImg from "./assets/turtle.jpg";
import cheetahImg from "./assets/cheetah.jpg";
import regularImg from "./assets/regular.jpg";
import rocketImg from "./assets/rocket.jpg";

const initialSnakeDots = [
  [0, 0],
  [30, 0],
  [60, 0],
  [90, 0],
  [120, 0],
  [150, 0],
];
const speedChoices = [
  { name: "TURTLE 🐢", speed: 400 },
  { name: "REGULAR 🥱", speed: 250 },
  { name: "CHEETAH 🐆", speed: 100 },
  { name: "FERRARI 🏎️", speed: 50 },
  { name: "SPACESHIP 🚀", speed: 25 },
];

const imageSources = [turtleImg, regularImg, cheetahImg, ferrariImg, rocketImg];

function App(): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const [speed, setSpeed] = useState(400);
  const [snakeDots, setSnakeDots] = useState(initialSnakeDots);
  const [selectedSpeed, setSelectedSpeed] = useState<
    "TURTLE" | "REGULAR" | "CHEETAH" | "FERRARI" | "SPACESHIP"
  >("TURTLE");
  const [foodDots, setFoodDots] = useState<number[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const [direction, setDirection] = useState<"up" | "down" | "left" | "right">(
    "right"
  );
  const [clearIntervalSnake, setClearIntervalSnake] = useState<any>();

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    if (!isGameOver) {
      const clear = setInterval(moveSnake, speed);
      setClearIntervalSnake(clear);
    }
  }, [direction, isGameOver]);

  useEffect(() => {
    eatFood();
    checkDead();
  }, [snakeDots]);

  useEffect(() => {
    generateFood();
  }, []);

  useEffect(() => {
    console.log(score);
    if (score > 12) {
      setSelectedSpeed("SPACESHIP");
      setSpeed(25);
    } else if (score > 9) {
      setSelectedSpeed("FERRARI");
      setSpeed(50);
    } else if (score > 6) {
      setSelectedSpeed("CHEETAH");
      setSpeed(100);
    } else if (score > 3) {
      setSelectedSpeed("REGULAR");
      setSpeed(250);
    }
  }, [score]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isGameOver) {
      if (e.key === "ArrowRight") {
        if (direction === "left") return;
        setDirection("right");
      }
      if (e.key === "ArrowDown") {
        if (direction === "up") return;
        setDirection("down");
      }
      if (e.key === "ArrowUp") {
        if (direction === "down") return;
        setDirection("up");
      }
      if (e.key === "ArrowLeft") {
        if (direction === "right") return;
        setDirection("left");
      }
    }
  };

  const moveSnake = () => {
    clearInterval(clearIntervalSnake);
    setSnakeDots((prevDots) => {
      const dots = [...prevDots];
      let head = dots[dots.length - 1];
      switch (direction) {
        case "right":
          head = [head[0] + 30, head[1]];
          break;
        case "left":
          head = [head[0] - 30, head[1]];
          break;
        case "up":
          head = [head[0], head[1] - 30];
          break;
        case "down":
          head = [head[0], head[1] + 30];
          break;
      }
      dots.push(head);
      dots.shift();

      return dots;
    });
  };

  const checkDead = () => {
    snakeDots.forEach((dots) => {
      if (dots[0] < 0 || dots[1] < 0 || dots[0] > 570 || dots[1] > 570) {
        setDirection("right");
        clearInterval(clearIntervalSnake);
        setIsGameOver(true);
      } else {
        return;
      }
    });
  };

  const generateFood = () => {
    const x = Math.floor(Math.random() * 570);
    const y = Math.floor(Math.random() * 570);

    const leftX = x % 30;
    const leftY = y % 30;

    snakeDots.forEach((dots) => {
      if (dots[0] === x + 30 - leftX && dots[1] === y + 30 - leftY) {
        generateFood();
      }
    });

    setFoodDots([x + 30 - leftX, y + 30 - leftY]);
  };

  const eatFood = () => {
    snakeDots.forEach((dots) => {
      if (foodDots[0] === dots[0] && foodDots[1] === dots[1]) {
        setSnakeDots((prevDots) => {
          // let newDots = [];

          // if (direction === "right" || direction === "left") {
          //   newDots = [prevDots[0][0], prevDots[0][0] - 30];
          // } else {
          //   newDots = [prevDots[0][0] - 30, prevDots[0][0]];
          // }
          return [[], ...prevDots];
        });

        setScore((prevScore) => prevScore + 1);

        generateFood();
      }
    });
  };

  const playAgain = () => {
    setSelectedSpeed("TURTLE");
    setSpeed(400);
    setIsGameOver(false);
    setScore(0);
    containerRef.current?.focus();
    setSnakeDots(initialSnakeDots);
    generateFood();
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="App"
    >
      <div style={{ marginRight: "20px" }}>
        {" "}
        {/* <h1> {score} 🏆 </h1>{" "} */}
      </div>
      <div className="play-ground">
        {isGameOver && (
          <div className="lost-modal">
            <p> YOU LOST! YOU SUCK!</p>
            <h2>💩</h2>
            <button onClick={playAgain}> PLAY AGAIN </button>
          </div>
        )}

        <div
          className="images-container"
          style={{
            left:
              selectedSpeed === "TURTLE"
                ? 0
                : selectedSpeed === "REGULAR"
                ? "-600px"
                : selectedSpeed === "CHEETAH"
                ? "-1200px"
                : selectedSpeed === "FERRARI"
                ? "-1800px"
                : selectedSpeed === "SPACESHIP"
                ? "-2400px"
                : "",
          }}
        >
          {imageSources.map((image, index) => {
            return (
              <img
                src={image}
                alt="bgimage"
                style={{
                  left: `${index * 600}px`,
                }}
                className="background-image"
              />
            );
          })}
        </div>
        <div className="snake-container">
          {snakeDots.map((pos, index) => {
            return (
              <img
                alt="sarah"
                src={sarah}
                key={index}
                style={{
                  position: "absolute",
                  left: pos[0],
                  top: pos[1],
                  borderRadius: index === snakeDots.length - 1 ? "10px" : 0,
                }}
                className="snake-square"
              />
            );
          })}
          {foodDots && (
            <div
              style={{
                backgroundColor: "white",
                position: "absolute",
                width: 30,
                height: 30,
                left: foodDots[0],
                top: foodDots[1],
              }}
            />
          )}
        </div>
      </div>
      <div className="speed-container">
        {speedChoices.map((choice) => {
          const splittedChoice: any = choice.name.split(" ");
          return (
            <div
              style={{
                backgroundColor:
                  splittedChoice[0] === selectedSpeed ? "green" : "white",
                color: splittedChoice[0] === selectedSpeed ? "white" : "black",
                opacity: splittedChoice[0] === selectedSpeed ? 1 : 0.7,
                boxShadow:
                  splittedChoice[0] === selectedSpeed ? "0 0 8px 4px  red" : "",
              }}
              key={choice.speed}
              className="speed-choice"
              onClick={() => {
                setSelectedSpeed(splittedChoice[0]);
                setSpeed(choice.speed);
              }}
            >
              <p> {splittedChoice[0]} </p>
              <p style={{ fontSize: 30, marginLeft: 10, marginBottom: 5 }}>
                {splittedChoice[1]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
