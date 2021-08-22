import React, { KeyboardEvent } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { ReactElement } from "react";
import { initialSnakeDots, imageSources, speedChoices } from "./helpers/data";
import "./App.css";
import sarah from "./sarah.png";
import beans from "./assets/beans.jpg";

type speedChoiceTypes =
  | "TURTLE"
  | "REGULAR"
  | "CHEETAH"
  | "FERRARI"
  | "SPACESHIP";
type directionTypes = "up" | "down" | "left" | "right";

function App(): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const [speed, setSpeed] = useState(400);
  const [snakeDots, setSnakeDots] = useState(initialSnakeDots);
  const [selectedSpeed, setSelectedSpeed] =
    useState<speedChoiceTypes>("TURTLE");
  const [foodDots, setFoodDots] = useState<number[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [direction, setDirection] = useState<directionTypes>("right");
  const [clearTimeoutSnake, setClearTimeoutSnake] = useState<any>();
  const [selfChosen, setSelfChosen] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    if (!isGameOver) {
      clearTimeout(clearTimeoutSnake);
      const clear = setTimeout(() => {
        moveSnake();
      }, speed);

      setClearTimeoutSnake(clear);
    }
  }, [direction, isGameOver, snakeDots]);

  useEffect(() => {
    eatFood();
    checkDead();
  }, [snakeDots]);

  useEffect(() => {
    generateFood();
  }, []);

  useEffect(() => {
    if (!selfChosen) {
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
      } else {
        setSelectedSpeed("TURTLE");
        setSpeed(400);
      }
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
        clearTimeout(clearTimeoutSnake);
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
    setSelfChosen(false);
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
        {/* <h1> {score} 🏆 </h1>{" "} */}
      </div>
      <div className="play-ground">
        {isGameOver && (
          <div className="lost-modal">
            <p> YOU LOST! YOU SUCK!</p>
            <h2>💩</h2>
            <p> Your score is : {score} </p>
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
                key={index}
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
                }}
                className="snake-square"
              />
            );
          })}
          {foodDots && (
            <img
              className="food-dot"
              style={{
                left: foodDots[0],
                top: foodDots[1],
              }}
              src={beans}
              alt="beans"
            />
          )}
        </div>
      </div>
      <div className="speed-container">
        {speedChoices.map((choice) => {
          const splittedChoice: any = choice.name.split(" ");
          const styles = {
            backgroundColor:
              splittedChoice[0] === selectedSpeed ? "green" : "white",
            color: splittedChoice[0] === selectedSpeed ? "white" : "black",
            opacity: splittedChoice[0] === selectedSpeed ? 1 : 0.7,
            boxShadow:
              splittedChoice[0] === selectedSpeed ? "0 0 8px 4px  red" : "",
          };

          return (
            <div
              style={styles}
              key={choice.speed}
              className="speed-choice"
              onClick={() => {
                setSelectedSpeed(splittedChoice[0]);
                setSpeed(choice.speed);
                setSelfChosen(true);
              }}
            >
              <p> {splittedChoice[0]} </p>
              <p
                style={{
                  fontSize: 30,
                  marginLeft: 15,
                  marginBottom: 3,
                }}
                className="emoji"
              >
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
