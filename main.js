import { getIsSoundActive, setIsSoundActive } from './settings.js';

import SoundEffectPlayer from './soundEffects.js';

const scrambleMovementAmount = 75;
const scrambleCooldown = 100;
const gameTimerCooldown = 10;

function main() {
  let board = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
  ];
  let emptySquare = [3, 3];
  let isSoundActive = getIsSoundActive() === false ? false : true;

  let scrambleCount = 0;

  let isGameRunning = false;
  let gameTimerInterval;
  let time = 0;

  const soundEffectPlayer = new SoundEffectPlayer();

  function getSquareId(x, y) {
    return `${x}-${y}`;
  }

  function isInsideBounds(x, y) {
    return (
      board.length > 0 &&
      x >= 0 &&
      x < board.length &&
      y >= 0 &&
      y < board[0].length
    );
  }

  function hasPlayerWon() {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if (board[i][j] != board.length * i + j + 1) {
          return false;
        }
      }
    }

    return true;
  }

  function generateBoard(size) {
    board = [];

    const boardElement = document.getElementById('gameBoard');
    boardElement.innerHTML = '';

    for (let i = 0; i < size; i++) {
      const row = [];

      let rowElement = document.createElement('div');
      rowElement.classList.add('gameRow');

      for (let j = 0; j < size; j++) {
        row.push(size * i + j + 1);

        const squareElement = document.createElement('div');
        squareElement.classList.add('gameSquare');
        squareElement.id = getSquareId(i, j);
        squareElement.innerText = size * i + j + 1;

        squareElement.addEventListener('click', event => onSquareClick(i, j));

        rowElement.appendChild(squareElement);
      }

      board.push(row);
      boardElement.appendChild(rowElement);
    }

    const lastSquare = document.getElementById(getSquareId(size - 1, size - 1));
    lastSquare.innerText = '';
    lastSquare.classList.add('empty');
  }

  function moveSquare(x, y) {
    if (!isInsideBounds(x, y) || (x == emptySquare[0] && y == emptySquare[1])) {
      return;
    }

    const tempEmptySquare = board[emptySquare[0]][emptySquare[1]];
    board[emptySquare[0]][emptySquare[1]] = board[x][y];

    document.getElementById(getSquareId(x, y)).innerText = '';
    document.getElementById(getSquareId(x, y)).classList.add('empty');
    document.getElementById(getSquareId(...emptySquare)).innerText =
      board[x][y];
    document
      .getElementById(getSquareId(...emptySquare))
      .classList.remove('empty');

    board[x][y] = tempEmptySquare;
    emptySquare = [x, y];

    if (isSoundActive) {
      soundEffectPlayer.playRandomSoundEffect();
    }

    if (hasPlayerWon()) {
      winGame();
    }
  }

  function scrambleBoard() {
    const scrambleInterval = setInterval(() => {
      const possibleMovements = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ].filter(delta =>
        isInsideBounds(emptySquare[0] + delta[0], emptySquare[1] + delta[1])
      );

      const delta =
        possibleMovements[Math.floor(Math.random() * possibleMovements.length)];

      moveSquare(emptySquare[0] + delta[0], emptySquare[1] + delta[1]);

      scrambleCount++;

      if (scrambleCount == scrambleMovementAmount) {
        scrambleCount = 0;
        clearInterval(scrambleInterval);
      }
    }, scrambleCooldown);
  }

  function updateTimer(newTime) {
    time = newTime;

    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const miliseconds = time % 1000;

    document.getElementById('gameTimer').innerText = `${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${miliseconds
      .toString()
      .padStart(3, '0')}`;
  }

  function startGame() {
    if (!isGameRunning) {
      document.getElementById('gameSize').disabled = true;
      document.getElementById('gameToggle').innerText = 'Reset';
      document.getElementById('gameToggle').className = 'toggleReset';

      scrambleBoard();

      setTimeout(() => {
        updateTimer(0);
        isGameRunning = true;

        gameTimerInterval = setInterval(
          () => updateTimer(time + gameTimerCooldown),
          gameTimerCooldown
        );
      }, scrambleMovementAmount * scrambleCooldown);
    }
  }

  function resetGame() {
    if (isGameRunning) {
      document.getElementById('gameSize').disabled = false;
      document.getElementById('gameToggle').innerText = 'Start';
      document.getElementById('gameToggle').className = 'toggleStart';

      isGameRunning = false;
      clearInterval(gameTimerInterval);

      updateTimer(0);

      generateBoard(Number(document.getElementById('gameSize').value));
    }
  }

  function winGame() {
    isGameRunning = false;
    clearInterval(gameTimerInterval);

    document.getElementById('gameSize').disabled = false;
    document.getElementById('gameToggle').innerText = 'Start';
    document.getElementById('gameToggle').className = 'toggleStart';
  }

  function onSquareClick(x, y) {
    if (!isGameRunning) {
      return;
    }

    if (x == emptySquare[0]) {
      if (y > emptySquare[1]) {
        for (let j = emptySquare[1] + 1; j <= y; j++) {
          moveSquare(x, j);
        }
      } else {
        for (let j = emptySquare[1] - 1; j >= y; j--) {
          moveSquare(x, j);
        }
      }
    } else if (y == emptySquare[1]) {
      if (x > emptySquare[0]) {
        for (let i = emptySquare[0] + 1; i <= x; i++) {
          moveSquare(i, y);
        }
      } else {
        for (let i = emptySquare[0] - 1; i >= x; i--) {
          moveSquare(i, y);
        }
      }
    }
  }

  function onChangeGameSize(event) {
    resetGame();
    generateBoard(Number(event.target.value));
  }

  document.addEventListener('keydown', event => {
    if (isGameRunning) {
      switch (event.code) {
        case 'KeyA':
        case 'ArrowLeft':
          event.preventDefault();
          moveSquare(emptySquare[0], emptySquare[1] + 1);
          break;
        case 'KeyW':
        case 'ArrowUp':
          event.preventDefault();
          moveSquare(emptySquare[0] + 1, emptySquare[1]);
          break;
        case 'KeyD':
        case 'ArrowRight':
          event.preventDefault();
          moveSquare(emptySquare[0], emptySquare[1] - 1);
          break;
        case 'KeyS':
        case 'ArrowDown':
          event.preventDefault();
          moveSquare(emptySquare[0] - 1, emptySquare[1]);
          break;
      }
    }
  });

  function onGameToggle() {
    if (isGameRunning) {
      resetGame();
    } else {
      startGame();
    }
  }

  function onSoundToggle() {
    isSoundActive = !isSoundActive;
    setIsSoundActive(!isSoundActive);

    if (isSoundActive) {
      document.getElementById('soundToggle').src =
        './assets/icons/volume-on.svg';
    } else {
      document.getElementById('soundToggle').src =
        './assets/icons/volume-off.svg';
    }
  }

  document
    .getElementById('gameSize')
    .addEventListener('change', event => onChangeGameSize(event));

  document.getElementById('gameToggle').addEventListener('click', onGameToggle);

  document
    .getElementById('soundToggle')
    .addEventListener('click', onSoundToggle);

  generateBoard(4);
}

main();
