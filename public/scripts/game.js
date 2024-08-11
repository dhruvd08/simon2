if (localStorage.length === 0) {
  window.open("/home", "_self");
}

const baseURL = "https://simon-rho.vercel.app";
//const baseURL = "http://localhost:8080"
const title = document.querySelector("#level-title");
const navbar = document.querySelector("nav");

let gamePattern = [];
let userClickedPattern = [];

let level = 0;

const buttonColors = ["red", "blue", "green", "yellow"];

function playSound(name) {
  let audio = new Audio(`./sounds/${name}.mp3`);
  audio.play();
}

async function uploadScore(name, score) {
  const currentDateTime = new Date();
  try {
    const response = await fetch(`${baseURL}/score`, {
      method: "POST",
      body: JSON.stringify({
        name: name,
        score: score,
        uploadTime: currentDateTime,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
  } catch (err) {
    throw err;
  }
}

function gameOver() {
  navbar.classList.remove("invisible");

  uploadScore(document.querySelector("#playerName").textContent, level - 1);

  title.textContent = "GAME OVER! TAP TO RESTART";
  userClickedPattern = [];
  gamePattern = [];
  level = 0;
  playSound("wrong");
  const body = document.body;

  body.classList.add("wrong");
  setTimeout(function () {
    body.classList.remove("wrong");
  }, 200);
}

function checkAnswer() {
  if (
    userClickedPattern[userClickedPattern.length - 1] ===
    gamePattern[userClickedPattern.length - 1]
  ) {
    if (userClickedPattern.toString() === gamePattern.toString()) {
      return "nextLevel";
    }
    return "continue";
  } else {
    return "gameOver";
  }
}

function animatePressed(color) {
  const btn = document.querySelector(`#${color}`);
  btn.classList.add("pressed");
  setTimeout(function () {
    btn.classList.remove("pressed");
  }, 100);
}

function nextSequence() {
  userClickedPattern = [];
  level++;
  title.textContent = `LEVEL ${level}`;

  let randomNumber = Math.floor(Math.random() * 4);
  let randomColor = buttonColors[randomNumber];
  gamePattern.push(randomColor);

  setTimeout(function () {
    playSound(randomColor);

    const selectedBtn = document.querySelector(`#${randomColor}`);
    selectedBtn.classList.add("flash");
    setTimeout(function () {
      selectedBtn.classList.remove("flash");
    }, 100);
  }, 600);
}

const buttons = document.querySelectorAll(".game-btn");

for (const btn of buttons) {
  btn.addEventListener("click", function (event) {
    if (level !== 0) {
      userChosenColor = event.target.getAttribute("id");
      userClickedPattern.push(userChosenColor);
      playSound(userChosenColor);
      animatePressed(userChosenColor);

      switch (checkAnswer()) {
        case "continue":
          break;

        case "nextLevel":
          nextSequence();
          break;

        case "gameOver":
          gameOver();
          break;

        default:
          break;
      }
    } else if (level === 0) {
      navbar.classList.add("invisible");
      nextSequence();
    }
  });
}

document.addEventListener("click", function (event) {
  if (level === 0 && event.target.tagName === "BODY") {
    navbar.classList.add("invisible");
    nextSequence();
  }
});
