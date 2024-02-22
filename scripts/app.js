const grid = document.querySelector(".grid");

let width = 8;
let cellCount = width * width;
let cells = [];
let clockisRunning = false;
let numberOfFlags = 10;
let firstMoveIndex = null;
let mineLocations = [];
let borderingIndexes = null;
let borderingCellsContainingMines = null;
let playerClickIndex = null;
let numberOfMines = 10;

const backgroundAudio = document.getElementById("birds");
const crunchAudio = document.getElementById("crunch");
const confettiAudio = document.getElementById("confetti");
const yippeeAudio = document.getElementById("yay");
backgroundAudio.loop = true;
backgroundAudio.play();

const flagDisplay = document.getElementById("flags");
flagDisplay.innerHTML = numberOfFlags;

const difficultyDropdown = document.getElementById("difficulty");
difficultyDropdown.addEventListener("change", difficultyLevel);

function difficultyLevel() {
  const selectedDifficulty = this.options[this.selectedIndex].text;
  if (selectedDifficulty === "Easy") {
    clearInterval(currentTime);
    cells = [];
    grid.innerHTML = "";
    width = 8;
    cellCount = width * width;
    createGrid();
    clockisRunning = false;
    cells.forEach((cell) =>
      cell.classList.remove(
        "flag",
        "mine",
        "checked",
        "uncovered",
        "finished",
        "zero",
        "one",
        "two",
        "three",
        "four",
        "five"
      )
    );
    mineLocations = [];
    count = 1;
    currentTime = null;
    updateTimer();
    numberOfFlags = 10;
    numberOfMines = 10;
    flagDisplay.innerHTML = numberOfFlags;
    cells.forEach((cell) => cell.addEventListener("click", startTimer));
    cells.forEach((cell) =>
      cell.addEventListener("click", numberofBorderingMines)
    );
    cells.forEach((cell) => cell.addEventListener("contextmenu", placeFlag));
    cells.forEach((cell) => cell.addEventListener("click", gameWon));
    cells.forEach((cell) => cell.addEventListener("contextmenu", gameWon));
  } else if (selectedDifficulty === "Medium") {
    clearInterval(currentTime);
    cells = [];
    grid.innerHTML = "";
    width = 12;
    cellCount = width * width;
    createGrid();
    clockisRunning = false;
    cells.forEach((cell) =>
      cell.classList.remove(
        "flag",
        "mine",
        "checked",
        "uncovered",
        "finished",
        "zero",
        "one",
        "two",
        "three",
        "four",
        "five"
      )
    );
    mineLocations = [];
    count = 1;
    currentTime = null;
    updateTimer();
    numberOfFlags = 22;
    numberOfMines = 22;
    flagDisplay.innerHTML = numberOfFlags;
    cells.forEach((cell) => cell.addEventListener("click", startTimer));
    cells.forEach((cell) =>
      cell.addEventListener("click", numberofBorderingMines)
    );
    cells.forEach((cell) => cell.addEventListener("contextmenu", placeFlag));
    cells.forEach((cell) => cell.addEventListener("click", gameWon));
    cells.forEach((cell) => cell.addEventListener("contextmenu", gameWon));
  }
  if (selectedDifficulty === "Hard") {
    clearInterval(currentTime);
    cells = [];
    grid.innerHTML = "";
    width = 16;
    cellCount = width * width;
    createGrid();
    clockisRunning = false;
    cells.forEach((cell) =>
      cell.classList.remove(
        "flag",
        "mine",
        "checked",
        "uncovered",
        "finished",
        "zero",
        "one",
        "two",
        "three",
        "four",
        "five"
      )
    );
    mineLocations = [];
    count = 1;
    currentTime = null;
    updateTimer();
    numberOfFlags = 52;
    numberOfMines = 52;
    flagDisplay.innerHTML = numberOfFlags;
    cells.forEach((cell) => cell.addEventListener("click", startTimer));
    cells.forEach((cell) =>
      cell.addEventListener("click", numberofBorderingMines)
    );
    cells.forEach((cell) => cell.addEventListener("contextmenu", placeFlag));
    cells.forEach((cell) => cell.addEventListener("click", gameWon));
    cells.forEach((cell) => cell.addEventListener("contextmenu", gameWon));
  }
}

function createGrid() {
  for (let i = 0; i < cellCount; i++) {
    const cell = document.createElement("div");
    grid.appendChild(cell);
    cells.push(cell);
    if (width === 12) {
      const gridCells = document.querySelectorAll(".grid div");
      gridCells.forEach((cell) => {
        cell.style.height = "8.3%";
        cell.style.width = "8.3%";
      });
    } else if (width === 16) {
      const gridCells = document.querySelectorAll(".grid div");
      gridCells.forEach((cell) => {
        cell.style.height = "6.25%";
        cell.style.width = "6.25%";
      });
    }
  }
}

createGrid();

const playAgainButton = document.querySelector(".restart");
const playAgainButtonWin = document.querySelector(".restart-win");
const gameLostPopUpContainer = document.querySelector(".lose-container");
gameLostPopUpContainer.style.display = "none";

const gameWonPopUpContainer = document.querySelector(".win-container");
gameWonPopUpContainer.style.display = "none";
const newHighScore = document.getElementById("gold");
newHighScore.style.display = "none";

const closePopUp = document.querySelector(".close-btn");
const popUpContainer = document.querySelector(".popup-container");
function instructions() {
  popUpContainer.style.display = "";
  closePopUp.addEventListener("click", function () {
    popUpContainer.style.display = "none";
  });
}
window.addEventListener("load", instructions);
const instructionsButton = document.querySelector(".open-popup");
instructionsButton.addEventListener("click", instructions);

// Stop watch timer below ------------------------------------

const timeDisplay = document.getElementById("timer");
let currentTime = null;
let count = 1;

function updateTimer() {
  timeDisplay.innerHTML = currentTime++;
}

// Stop watch will only start once! --------------------------
function startTimer(event) {
  if (clockisRunning === false) {
    currentTime = setInterval(() => {
      timeDisplay.innerHTML = count;
      count++;
      clockisRunning = true;
    }, 1000);
    firstMoveIndex = cells.indexOf(event.target);
    mineDistribution();
  }
}

cells.forEach((cell) => cell.addEventListener("click", startTimer));

// Randomly distribute 10 mines ----------------------------
// Generate 10 random numbers from 0 - 63 (excluding firstMoveIndex)
// These will be the indeces of the mines in the cell array

function mineDistribution() {
  while (mineLocations.length < numberOfMines) {
    let num = Math.floor(Math.random() * (cellCount - 1));
    if (num === firstMoveIndex || mineLocations.includes(cells[num])) {
      mineDistribution();
    } else {
      mineLocations.push(cells[num]);
    }
  }
  mineLocations.map((cell) => cell.classList.add("mine"));
}

// Set rules for the remaining tiles
// Each cell borders 8 other cells
// If the cell borders 1 mine, it displays the number 1
// If the cell borders 2 mines, it dispalys the number 2.. and so on.
// If the cell doesn't display any mines, it remains blank
// The numbers on the cells should dynamically update as soon as the game
// begins, i.e. the player makes their first choice
// if cells i-9, i-8, i-7, i-1, i+1, i+7, i+8, i+9 contain class "mines"
// display the number that contain class "mines"

function numberDisplay() {
  // e.g. 1, 8, 9
  // filter the array of index to
  borderingCellsContainingMines = borderingIndexes
    // .filter((index) => index >= 0 && index < cells.length)
    .map((index) => cells[index]) // change the indexes into the element in the cells array i.e. 1 become cells[1] = div
    .filter((cell) => cell.classList.contains("mine")); // filter the array to contain only divs with the mine class list
  // an array of bordering cells that do not contain mines
  if (borderingCellsContainingMines.length === 0) {
    cells[playerClickIndex].classList.add("zero");
    borderingIndexes.forEach((index) => {
      const cell = cells[index];
      if (!cell.classList.contains("checked")) {
        cell.classList.add("checked");
        playerClickIndex = index;
        numberofBorderingMines({ target: cell });
      }
    });
  } else if (borderingCellsContainingMines.length === 1) {
    cells[playerClickIndex].classList.add("one");
  } else if (borderingCellsContainingMines.length === 2) {
    cells[playerClickIndex].classList.add("two");
  } else if (borderingCellsContainingMines.length === 3) {
    cells[playerClickIndex].classList.add("three");
  } else if (borderingCellsContainingMines.length === 4) {
    cells[playerClickIndex].classList.add("four");
  } else if (borderingCellsContainingMines.length === 5) {
    cells[playerClickIndex].classList.add("five");
  }
  // give the cell the class list that is equal to the number of bordering mines
  // e.g. two bordering cells that contain mines? assign class list 'two'
}

function blowUp(event) {
  event.target.classList.add("uncovered");
  crunchAudio.play();
}

function numberofBorderingMines(event) {
  playerClickIndex = cells.indexOf(event.target); // we click on a div, what is the index of the div in the cells array?
  if (event.target.classList.contains("mine")) {
    blowUp(event); // if the div we clicked on contains a mine, reveal the mine
    setTimeout(gameLost, 500);
  } else if (cells.indexOf(event.target) === 0) {
    // if the cell index = 0
    borderingIndexes = [
      // make a note of the bordering cells, e.g. 1, 8, 9
      playerClickIndex + 1,
      playerClickIndex + width,
      playerClickIndex + width + 1,
    ];
    numberDisplay(); // then execute the number display function
  } else if (cells.indexOf(event.target) === width - 1) {
    borderingIndexes = [
      playerClickIndex - 1,
      playerClickIndex + width,
      playerClickIndex + width - 1,
    ];
    numberDisplay();
  } else if (cells.indexOf(event.target) === cellCount - width) {
    borderingIndexes = [
      playerClickIndex + 1,
      playerClickIndex - width,
      playerClickIndex - width + 1,
    ];
    numberDisplay();
  } else if (cells.indexOf(event.target) === cellCount - 1) {
    borderingIndexes = [
      playerClickIndex - 1,
      playerClickIndex - width,
      playerClickIndex - width - 1,
    ];
    numberDisplay();
  } else if (cells.indexOf(event.target) < width) {
    borderingIndexes = [
      playerClickIndex - 1,
      playerClickIndex + 1,
      playerClickIndex + width - 1,
      playerClickIndex + width,
      playerClickIndex + width + 1,
    ];
    numberDisplay();
  } else if (cells.indexOf(event.target) > cellCount - width - 1) {
    borderingIndexes = [
      playerClickIndex - 1,
      playerClickIndex + 1,
      playerClickIndex - width - 1,
      playerClickIndex - width,
      playerClickIndex - width + 1,
    ];
    numberDisplay();
  } else if (cells.indexOf(event.target) % width === 0) {
    borderingIndexes = [
      playerClickIndex + 1,
      playerClickIndex + width,
      playerClickIndex + width + 1,
      playerClickIndex - width,
      playerClickIndex - width + 1,
    ];
    numberDisplay();
  } else if (cells.indexOf(event.target) % width === width - 1) {
    borderingIndexes = [
      playerClickIndex - 1,
      playerClickIndex + width - 1,
      playerClickIndex + width,
      playerClickIndex - width - 1,
      playerClickIndex - width,
    ];
    numberDisplay();
  } else {
    borderingIndexes = [
      playerClickIndex - 1,
      playerClickIndex + 1,
      playerClickIndex + (width - 1),
      playerClickIndex + width,
      playerClickIndex + (width + 1),
      playerClickIndex - (width - 1),
      playerClickIndex - width,
      playerClickIndex - (width + 1),
    ];
    numberDisplay();
  }
}

cells.forEach((cell) => cell.addEventListener("click", numberofBorderingMines));

// if a user right clicks, they can place a flag in a cell. This can also be removed, if a flag is already present.
// this decreases the total number of flags in the navigation bar

function placeFlag(event) {
  if (clockisRunning === true) {
    event.preventDefault();
    if (event.target.classList.contains("flag")) {
      numberOfFlags++;
      flagDisplay.innerHTML = numberOfFlags;
      event.target.classList.remove("flag");
    } else {
      numberOfFlags--;
      flagDisplay.innerHTML = numberOfFlags;
      event.target.classList.add("flag");
    }
  }
}

cells.forEach((cell) => cell.addEventListener("contextmenu", placeFlag));

// when a player clicks on a blank cell
// i.e. a cell which does not border any cells containing mines
// all bording blank cells are also revealed

// if a mine is uncovered, stop the game.

function gameLost() {
  if (clockisRunning === true) {
    clearInterval(currentTime);
    gameLostPopUpContainer.style.display = "flex";
    // cells.forEach((cell) => cell.removeEventListener("click", startTimer));
    // cells.forEach((cell) =>
    //   cell.removeEventListener("click", numberofBorderingMines)
    // );
    // cells.forEach((cell) => cell.removeEventListener("contextmenu", placeFlag));
  }
}

function restartGame() {
  clockisRunning = false;
  clearInterval(currentTime);
  gameLostPopUpContainer.style.display = "none";
  gameWonPopUpContainer.style.display = "none";
  cells.forEach((cell) =>
    cell.classList.remove(
      "flag",
      "mine",
      "checked",
      "uncovered",
      "finished",
      "zero",
      "one",
      "two",
      "three",
      "four",
      "five"
    )
  );
  mineLocations = [];
  count = 1;
  currentTime = null;
  updateTimer();
  if (width === 8) {
    numberOfFlags = 10;
  } else if (width === 16) {
    numberOfFlags = 52;
  } else if (width === 12) {
    numberOfFlags = 22;
  }
  flagDisplay.innerHTML = numberOfFlags;
  cells.forEach((cell) => cell.addEventListener("click", startTimer));
}

playAgainButton.addEventListener("click", restartGame);

// update the styling
// add a reset button
// add the win conditions
const updateHighScore = document.getElementById("highscore");
updateHighScore.innerText = localStorage.getItem("highscore");
const yourScoreDisplay = document.getElementById("player-score");
const highScoreDisplay = document.getElementById("high-score");

function gameWon() {
  if (
    flagDisplay.innerHTML === "0" &&
    mineLocations.every((mine) => mine.classList.contains("flag"))
  ) {
    clearInterval(currentTime);
    cells
      .filter(
        (cell) => cell.classList.contains("zero") || cell.classList.length === 0
      )
      .forEach((cell) => {
        cell.classList.remove("zero");
        cell.classList.add("finished");
      });
    const playerScore = Number(document.getElementById("timer").innerText);
    const highScore = localStorage.getItem("highscore");
    yippeeAudio.play();
    if (!highScore || playerScore < highScore) {
      setTimeout(
        () =>
          confetti(
            {
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            },
            confettiAudio.play()
          ),
        2100
      );
      newHighScore.style.display = "";
      localStorage.setItem("highscore", playerScore);
      updateHighScore.innerText = playerScore;
      yourScoreDisplay.innerText = playerScore;
      highScoreDisplay.innerText = playerScore;
    } else {
      yourScoreDisplay.innerText = playerScore;
      highScoreDisplay.innerText = highScore;
      yippeeAudio.play();
    }
    setTimeout(
      (winPopup = () => {
        gameWonPopUpContainer.style.display = "";
      }),
      2000
    );
    playAgainButtonWin.addEventListener("click", restartGame);
  }
}

cells.forEach((cell) => cell.addEventListener("click", gameWon));
cells.forEach((cell) => cell.addEventListener("contextmenu", gameWon));

// none of the mines have been uncovered
// and all other cells have been checked
// and the number of flags = 0

// trigger pop up windows
// one for page load
// one for win
// one for loss
// add reset buttons
