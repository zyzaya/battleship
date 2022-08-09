/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Battleship.js":
/*!***************************!*\
  !*** ./src/Battleship.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Battleship)
/* harmony export */ });
/* harmony import */ var _Board__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Board */ "./src/Board.js");
/* harmony import */ var _ShipNames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ShipNames */ "./src/ShipNames.js");



function Battleship(player1, player2) {
  let obj = {};
  let size = 10;
  let p1Board = (0,_Board__WEBPACK_IMPORTED_MODULE_0__["default"])(size);
  let p2Board = (0,_Board__WEBPACK_IMPORTED_MODULE_0__["default"])(size);
  let isP1Turn = true;
  let isP1Winner = false;
  obj.onDraw = {};
  obj.onGameEnd = {};

  let isValidGuess = function (x, y) {
    return x >= 0 && x < size && y >= 0 && y < size;
  };

  obj.placeShip = function (name, x, y, horizontal, isPlayer1) {
    if (isPlayer1 && p1Board.isValidShipPlacement(name, x, y, horizontal))
      p1Board.placeShip(name, x, y, horizontal);
    else if (p2Board.isValidShipPlacement(name, x, y, horizontal))
      p2Board.placeShip(name, x, y, horizontal);
  };

  obj.getShipInfo = function (name, isPlayer1) {
    return isPlayer1 ? p1Board.getShipInfo(name) : p2Board.getShipInfo(name);
  };

  let nextTurn = async function () {
    let opponentBoard = isP1Turn ? p2Board : p1Board;
    let currentPlayer = isP1Turn ? player1 : player2;
    let guess = await currentPlayer.getGuess();
    if (!isValidGuess(guess.x, guess.y))
      throw new RangeError(
        `Player ${isP1Turn ? '1' : '2'} guess is invalid. (${guess})`
      );

    let isHit = opponentBoard.hit(guess.x, guess.y);
    currentPlayer.setFeedback(isHit);
    if (obj.onDraw instanceof Function) {
      obj.onDraw();
    }
    isP1Turn = !isP1Turn;
    if (Object.values(_ShipNames__WEBPACK_IMPORTED_MODULE_1__["default"]).every((name) => opponentBoard.isSunk(name))) {
      isP1Winner = !isP1Turn;
      if (obj.onGameEnd instanceof Function) obj.onGameEnd();
    } else {
      nextTurn();
    }
  };

  obj.isP1Turn = function () {
    return isP1Turn;
  };

  obj.isP1Winner = function () {
    return isP1Winner;
  };

  obj.start = function () {
    isP1Turn = true;
    nextTurn();
  };

  obj.reset = function () {
    isP1Turn = true;
    isP1Winner = false;
    p1Board.reset();
    p2Board.reset();
    player1.reset();
    player2.reset();
  };
  return obj;
}


/***/ }),

/***/ "./src/Board.js":
/*!**********************!*\
  !*** ./src/Board.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Board)
/* harmony export */ });
/* harmony import */ var _Ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Ship */ "./src/Ship.js");
/* harmony import */ var _ShipNames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ShipNames */ "./src/ShipNames.js");



function Board(size) {
  let ships = {};
  ships[_ShipNames__WEBPACK_IMPORTED_MODULE_1__["default"].Carrier] = (0,_Ship__WEBPACK_IMPORTED_MODULE_0__["default"])(5);
  ships[_ShipNames__WEBPACK_IMPORTED_MODULE_1__["default"].Battleship] = (0,_Ship__WEBPACK_IMPORTED_MODULE_0__["default"])(4);
  ships[_ShipNames__WEBPACK_IMPORTED_MODULE_1__["default"].Destroyer] = (0,_Ship__WEBPACK_IMPORTED_MODULE_0__["default"])(3);
  ships[_ShipNames__WEBPACK_IMPORTED_MODULE_1__["default"].Submarine] = (0,_Ship__WEBPACK_IMPORTED_MODULE_0__["default"])(3);
  ships[_ShipNames__WEBPACK_IMPORTED_MODULE_1__["default"].PatrolBoat] = (0,_Ship__WEBPACK_IMPORTED_MODULE_0__["default"])(2);
  let placedShips = [];
  let validateShipInfo = function (name, x, y, horizontal) {
    if (ships[name] === undefined)
      throw new Error('Error: name must be a valid ship name');
    if (x < 0) throw new RangeError('x must be greater than or equal to zero');
    if (y < 0) throw new RangeError('y must be greater than or equal to zero');
    if (horizontal && x + ships[name].getLength() - 1 >= size)
      throw new RangeError(
        `x ${
          x + ships[name].getLength() - 1
        } must be less than the size of the board (${size})`
      );
    if (!horizontal && y + ships[name].getLength() - 1 >= size)
      throw new RangeError(
        `y (${
          y + ships[name].getLength() - 1
        }) must be less than the size of the board (${size})`
      );
  };

  let isValidShipPlacement = function (name, x, y, horizontal) {
    if (ships[name] === undefined)
      throw new Error('Error: name must be a valid ship name');
    let left = x;
    let top = y;
    let right = horizontal ? left + ships[name].getLength() - 1 : left;
    let bottom = horizontal ? top : top + ships[name].getLength() - 1;
    if (left < 0 || right < 0 || right >= size || bottom >= size) return false;

    return !placedShips.some((val) => {
      if (val !== name) {
        let l = ships[val].getOrigin().x;
        let t = ships[val].getOrigin().y;
        let r = ships[val].isHorizontal() ? l + ships[val].getLength() - 1 : l;
        let b = ships[val].isHorizontal() ? t : t + ships[val].getLength() - 1;
        // ships collide
        if (
          ((left >= l && left <= r) || (right >= l && right <= r)) &&
          ((top >= t && top <= b) || (bottom >= t && bottom <= b))
        ) {
          return true;
        }
      }
    });
  };

  let placeShip = function (name, x, y, horizontal) {
    validateShipInfo(name, x, y, horizontal);
    if (!isValidShipPlacement(name, x, y, horizontal)) return false;
    ships[name].setOrigin(x, y);
    ships[name].setHorizontal(horizontal);
    if (!placedShips.includes(name)) placedShips.push(name);
    return true;
  };

  let removeShip = function (name) {
    if (ships[name] === undefined)
      throw new Error('Error: name must be a valid ship name');
    placedShips = placedShips.filter((v) => v !== name);
    ships[name].resetHits();
  };

  let hit = function (x, y) {
    for (const name in ships) {
      if (placedShips.includes(name) && ships[name].hit(x, y)) return name;
    }
    return false;
  };

  let isSunk = function (name) {
    if (ships[name] === undefined)
      throw new Error('Error: name must be a valid ship name');
    return ships[name].isSunk();
  };

  let getShipInfo = function (name) {
    if (ships[name] === undefined)
      throw new Error('Error: name must be a valid ship name');
    if (!placedShips.includes(name)) return undefined;
    return {
      origin: ships[name].getOrigin(),
      horizontal: ships[name].isHorizontal(),
      sunk: ships[name].isSunk(),
      length: ships[name].getLength(),
    };
  };

  let reset = function () {
    for (const name in _ShipNames__WEBPACK_IMPORTED_MODULE_1__["default"]) {
      removeShip(name);
    }
  };

  return {
    placeShip,
    removeShip,
    hit,
    isSunk,
    getShipInfo,
    isValidShipPlacement,
    reset,
  };
}


/***/ }),

/***/ "./src/Display.js":
/*!************************!*\
  !*** ./src/Display.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Display)
/* harmony export */ });
/* harmony import */ var _DisplayBoard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DisplayBoard */ "./src/DisplayBoard.js");
/* harmony import */ var _ShipNames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ShipNames */ "./src/ShipNames.js");
/* harmony import */ var _Shipyard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Shipyard */ "./src/Shipyard.js");




function Display(battleship, player, opponent, container) {
  let opponentDisplay = (0,_DisplayBoard__WEBPACK_IMPORTED_MODULE_0__["default"])(container, 'opponent');
  opponentDisplay.allowShipPlacement(false);
  let playerDisplay = (0,_DisplayBoard__WEBPACK_IMPORTED_MODULE_0__["default"])(container, 'player');
  let shipyard = (0,_Shipyard__WEBPACK_IMPORTED_MODULE_2__["default"])(container, 'player');
  playerDisplay.allowShipPlacement(true);
  let start = document.createElement('button');
  let info = document.createElement('div');
  let reset = document.createElement('button');

  let isAllShipsPlaced = function () {
    return Object.keys(_ShipNames__WEBPACK_IMPORTED_MODULE_1__["default"]).every(
      (name) => battleship.getShipInfo(name, true) !== undefined
    );
  };

  let setupShipPlacement = function () {
    playerDisplay.onCellDrop = (e) => {
      e.preventDefault();
      let info = JSON.parse(e.dataTransfer.getData('text'));
      let origin = playerDisplay.cellFromPoint(
        e.x - e.offsetX - info.offsetX + 25,
        e.y - e.offsetY - info.offsetY + 25
      );
      if (origin !== undefined)
        battleship.placeShip(
          info.name,
          origin.x,
          origin.y,
          info.horizontal,
          true
        );
      playerDisplay.drawShip(
        info.name,
        battleship.getShipInfo(info.name, true)
      );
      if (isAllShipsPlaced()) start.disabled = false;
    };
  };
  let setupGuessing = function () {
    opponentDisplay.onCellClick = (e) => {
      let origin = opponentDisplay.cellFromPoint(
        e.x - e.offsetX,
        e.y - e.offsetY
      );
      player.setGuess(origin.x, origin.y);
    };
  };

  let setupShipyard = function () {
    shipyard.onShipDragStart = (e, name) => {
      let info = battleship.getShipInfo(name, true);
      let horizontal = info === undefined ? false : info.horizontal;
      e.dataTransfer.setData(
        'text',
        JSON.stringify({
          name: name,
          offsetX: e.offsetX,
          offsetY: e.offsetY,
          horizontal: horizontal,
        })
      );
    };
    shipyard.onShipClick = (e, name) => {
      let info = battleship.getShipInfo(name, true);
      if (info === undefined) return;
      battleship.placeShip(
        name,
        info.origin.x,
        info.origin.y,
        !info.horizontal,
        true
      );
      playerDisplay.drawShip(name, battleship.getShipInfo(name, true));
    };
  };

  let setupStart = function () {
    let startDiv = document.createElement('div');
    startDiv.classList.add('startDiv');
    start.classList.add('start');
    start.disabled = true;
    start.textContent = 'Start Game';
    start.onclick = () => {
      for (const name in _ShipNames__WEBPACK_IMPORTED_MODULE_1__["default"]) {
        let pos = opponent.getShipPosition(name);
        battleship.placeShip(name, pos.x, pos.y, pos.horizontal, false);
      }
      playerDisplay.allowShipPlacement(false);
      battleship.start();
      start.classList.add('invisible');
      info.textContent = 'Make your guess!';
    };
    startDiv.appendChild(start);
    container.appendChild(startDiv);
  };

  let setupInfo = function () {
    info.classList.add('info');
    info.textContent = 'Place your ships!';
    container.appendChild(info);
  };

  let setupReset = function () {
    reset.classList.add('reset');
    reset.classList.add('invisible');
    reset.textContent = 'Play Again';
    reset.onclick = () => {
      shipyard.reset();
      opponentDisplay.reset();
      playerDisplay.reset();
      battleship.reset();
      reset.classList.add('invisible');
      start.classList.remove('invisible');
      start.disabled = true;
      info.textContent = 'Place your ships!';
    };
    container.appendChild(reset);
  };

  let drawShips = function () {
    for (const name in _ShipNames__WEBPACK_IMPORTED_MODULE_1__["default"]) {
      playerDisplay.drawShip(name, battleship.getShipInfo(name, true));
    }
  };

  let drawGuesses = function () {
    player.getHistory().forEach((e) => {
      opponentDisplay.drawGuess(e.x, e.y, e.isHit);
    });

    opponent.getHistory().forEach((e) => {
      playerDisplay.drawGuess(e.x, e.y, e.isHit);
    });
  };

  let draw = function () {
    drawShips();
    drawGuesses();
    if (!battleship.isP1Turn()) {
      let playerHistory = player.getHistory();
      let playerGuess = playerHistory[playerHistory.length - 1];
      let opponentHistory = opponent.getHistory();
      let opponentGuess = opponentHistory[opponentHistory.length - 1];
      info.textContent = `${playerGuess.isHit ? 'Hit' : 'Miss'}!
        Opponent ${opponentGuess.isHit ? 'hit' : 'missed'}!
        Guess again!`;
    }
  };

  let endGame = function () {
    info.textContent = `${battleship.isP1Winner() ? 'Player' : 'Opponent'}
      wins! All ships sunk! Play again?`;
    reset.classList.remove('invisible');
  };

  let setup = function () {
    setupShipPlacement();
    setupGuessing();
    setupShipyard();
    setupStart();
    setupInfo();
    setupReset();
  };

  setup();
  return { draw, endGame };
}


/***/ }),

/***/ "./src/DisplayBoard.js":
/*!*****************************!*\
  !*** ./src/DisplayBoard.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DisplayBoard)
/* harmony export */ });
function DisplayBoard(container, name) {
  let div = document.createElement('div');
  div.classList.add('board');
  let imageDiv = document.createElement('div');
  imageDiv.classList.add('grid');
  div.appendChild(imageDiv);

  let displayBoard = {};
  displayBoard.onCellDrop = {};
  displayBoard.onCellClick = {};
  displayBoard.cellFromPoint = function (x, y) {
    let cell = document.elementFromPoint(x, y);
    if (cell.classList.contains('cell') && div.contains(cell))
      return JSON.parse(cell.id);
    else return undefined;
  };

  displayBoard.allowShipPlacement = function (allow) {
    for (let i = 0; i < div.children.length; i++) {
      let cell = div.children[i];
      if (cell.classList.contains('cell') && div.contains(cell)) {
        if (allow) cell.classList.remove('cellForward');
        else cell.classList.add('cellForward');
      }
    }
  };

  displayBoard.drawShip = function (shipName, info) {
    if (info != undefined) {
      let ship = document.getElementById(name + shipName);
      let right = info.origin.x + 3;
      let bottom = info.origin.y + 3;
      if (info.horizontal) {
        right += info.length - 1;
        ship.classList.remove('verticalShip');
        ship.classList.add('horizontalShip');
      } else {
        bottom += info.length - 1;
        ship.classList.remove('horizontalShip');
        ship.classList.add('verticalShip');
      }
      ship.style.gridArea = `
            ${info.origin.y + 2} /
            ${info.origin.x + 2} /
            ${bottom} /
            ${right}`;
      div.appendChild(ship);
    }
  };

  displayBoard.drawGuess = function (x, y, isHit) {
    let cell = document.getElementById(JSON.stringify({ name, x, y }));
    cell.textContent = isHit ? 'X' : '0';
  };

  displayBoard.reset = function () {
    for (let i = 0; i < div.children.length; i++) {
      let cell = div.children[i];
      if (cell.classList.contains('cell') && div.contains(cell)) {
        cell.textContent = '';
        cell.classList.remove('cellForward');
      }
    }
  };

  let setupCells = function () {
    for (let y = 0; y < 11; y++) {
      for (let x = 0; x < 11; x++) {
        let cell = document.createElement('div');
        cell.id = JSON.stringify({ name, x: x - 1, y: y - 1 });
        cell.style.gridArea = `${y + 1} / ${x + 1} / ${y + 2} / ${x + 2}`;
        if (y === 0 && x > 0) {
          cell.textContent = String.fromCharCode(64 + x);
          cell.classList.add('labelCell');
        } else if (x === 0 && y > 0) {
          cell.textContent = y.toString();
          cell.classList.add('labelCell');
        } else if (x > 0 && y > 0) {
          cell.classList.add('cell');
        }

        cell.ondragover = (e) => e.preventDefault();
        cell.ondrop = (e) => {
          if (displayBoard.onCellDrop instanceof Function)
            displayBoard.onCellDrop(e, x + 1, y + 1);
        };
        cell.onclick = (e) => {
          if (displayBoard.onCellClick instanceof Function)
            displayBoard.onCellClick(e, x + 1, y + 1);
        };
        div.appendChild(cell);
      }
    }
    container.appendChild(div);
  };

  setupCells();
  return displayBoard;
}


/***/ }),

/***/ "./src/Player.js":
/*!***********************!*\
  !*** ./src/Player.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Player)
/* harmony export */ });
function Player() {
  let guess = undefined;
  let history = [];

  let getGuess = async function () {
    while (guess === undefined) {
      await new Promise((resolve) => {
        setTimeout(() => resolve(), 50);
      });
    }
    let ret = { x: guess.x, y: guess.y, isHit: false };
    history.push(ret);
    guess = undefined;
    return ret;
  };

  let setGuess = function (x, y) {
    let attempt = { x: x, y: y };
    if (history.find((v) => v.x === attempt.x && v.y === attempt.y)) return;
    guess = attempt;
  };

  let setFeedback = function (isHit) {
    history[history.length - 1].isHit = isHit;
  };

  let getHistory = function () {
    return [...history];
  };

  let reset = function () {
    guess = undefined;
    history = [];
  };

  return { getGuess, setGuess, getHistory, setFeedback, reset };
}


/***/ }),

/***/ "./src/Ship.js":
/*!*********************!*\
  !*** ./src/Ship.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Ship)
/* harmony export */ });
function Ship(length) {
  if (!Number.isInteger(length))
    throw new TypeError('length must be an integer');
  else if (length < 0)
    throw new RangeError('Ship length cannot be less than zero');
  let x = 0;
  let y = 0;
  let horizontal = false;
  let hits = [];

  let getLength = () => {
    return length;
  };

  let setOrigin = (newX, newY) => {
    if (!Number.isInteger(newX)) throw new TypeError('x must be an integer');
    else if (!Number.isInteger(newY))
      throw new TypeError('y must be an integer');

    x = newX;
    y = newY;
  };

  let getOrigin = () => {
    return {
      x,
      y,
    };
  };

  let isHorizontal = () => {
    return horizontal;
  };

  let setHorizontal = (value) => {
    horizontal = !!value;
  };

  let hit = (targetX, targetY) => {
    if (!Number.isInteger(targetX))
      throw new TypeError('targetX must be an integer');
    else if (!Number.isInteger(targetY))
      throw new TypeError('targetY must be an integer');

    let success =
      (horizontal && y === targetY && targetX >= x && targetX < x + length) ||
      (!horizontal && x === targetX && targetY >= y && targetY < y + length);
    if (success) hits.push({ x: targetX, y: targetY });
    return success;
  };

  let isSunk = () => {
    if (hits.length === 0) return false;
    return (
      hits.length === length &&
      hits.every((v) => {
        if (horizontal) return v.y === y && v.x >= x && v.x < x + length;
        else return v.x === x && v.y >= y && v.y < y + length;
      })
    );
  };

  let resetHits = () => (hits.length = 0);
  return {
    getLength,
    getOrigin,
    setOrigin,
    isHorizontal,
    setHorizontal,
    hit,
    isSunk,
    resetHits,
  };
}


/***/ }),

/***/ "./src/ShipNames.js":
/*!**************************!*\
  !*** ./src/ShipNames.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((function ShipNames() {
  return {
    Carrier: 'Carrier',
    Battleship: 'Battleship',
    Destroyer: 'Destroyer',
    Submarine: 'Submarine',
    PatrolBoat: 'PatrolBoat',
  };
})());


/***/ }),

/***/ "./src/Shipyard.js":
/*!*************************!*\
  !*** ./src/Shipyard.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Shipyard)
/* harmony export */ });
/* harmony import */ var _ShipNames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ShipNames */ "./src/ShipNames.js");


function Shipyard(container, name) {
  let shipyard = {};
  let div = document.createElement('div');
  div.classList.add(name + 'shipyard');
  shipyard.onShipClick = {};
  shipyard.onShipDragStart = {};

  for (const shipName in _ShipNames__WEBPACK_IMPORTED_MODULE_0__["default"]) {
    let ship = document.createElement('div');
    ship.classList.add(shipName);
    ship.id = name + shipName;
    ship.classList.add('ship');
    ship.classList.add('verticalShip');
    ship.style.gridArea = shipName;
    ship.draggable = true;
    ship.ondragstart = (e) => {
      if (shipyard.onShipDragStart instanceof Function)
        shipyard.onShipDragStart(e, shipName);
    };
    ship.onclick = (e) => {
      if (shipyard.onShipClick instanceof Function)
        shipyard.onShipClick(e, shipName);
    };
    ship.textContent = shipName;
    div.appendChild(ship);
  }

  shipyard.reset = function () {
    for (const shipName in _ShipNames__WEBPACK_IMPORTED_MODULE_0__["default"]) {
      let ship = document.getElementById(name + shipName);
      ship.classList.remove('horizontalShip');
      ship.classList.add('verticalShip');
      ship.style.gridArea = shipName;
      div.appendChild(ship);
    }
  };

  container.appendChild(div);
  return shipyard;
}


/***/ }),

/***/ "./src/SimpleAI.js":
/*!*************************!*\
  !*** ./src/SimpleAI.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SimpleAI)
/* harmony export */ });
/* harmony import */ var _Board__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Board */ "./src/Board.js");
/* harmony import */ var _ShipNames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ShipNames */ "./src/ShipNames.js");



function SimpleAI() {
  let size = 10;
  let remainingGuesses = [];
  let history = [];
  let ships = {};

  let getRandomPosition = function () {
    let min = 0;
    let max = size;
    return {
      x: Math.floor(Math.random() * (max - min + 1)) + min,
      y: Math.floor(Math.random() * (max - min + 1)) + min,
      horizontal: Math.random() < 0.5,
    };
  };

  let shuffleShipPositions = function () {
    let board = (0,_Board__WEBPACK_IMPORTED_MODULE_0__["default"])(size);

    for (const name in _ShipNames__WEBPACK_IMPORTED_MODULE_1__["default"]) {
      let pos = getRandomPosition();
      while (!board.isValidShipPlacement(name, pos.x, pos.y, pos.horizontal)) {
        pos = getRandomPosition();
      }
      board.placeShip(name, pos.x, pos.y, pos.horizontal);
      ships[name] = pos;
    }
  };

  let getShipPosition = function (name) {
    return ships[name];
  };

  let getGuess = function () {
    let i = Math.floor(Math.random() * remainingGuesses.length);
    let guess = remainingGuesses[i];
    guess.isHit = false;
    history.push(guess);
    remainingGuesses.splice(i, 1);
    return guess;
  };

  let setFeedback = function (isHit) {
    history[history.length - 1].isHit = isHit;
  };

  let getHistory = function () {
    return [...history];
  };

  let reset = function () {
    shuffleShipPositions();
    history = [];
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        remainingGuesses.push({ x, y });
      }
    }
  };

  reset();
  return { getGuess, getHistory, getShipPosition, reset, setFeedback };
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Battleship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Battleship */ "./src/Battleship.js");
/* harmony import */ var _Display__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Display */ "./src/Display.js");
/* harmony import */ var _Player__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Player */ "./src/Player.js");
/* harmony import */ var _SimpleAI__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SimpleAI */ "./src/SimpleAI.js");





let container = document.getElementById('container');
let player = (0,_Player__WEBPACK_IMPORTED_MODULE_2__["default"])();
let opponent = (0,_SimpleAI__WEBPACK_IMPORTED_MODULE_3__["default"])();
let battleship = (0,_Battleship__WEBPACK_IMPORTED_MODULE_0__["default"])(player, opponent);
let display = (0,_Display__WEBPACK_IMPORTED_MODULE_1__["default"])(battleship, player, opponent, container);
battleship.onDraw = () => {
  display.draw();
};
battleship.onGameEnd = () => {
  display.endGame();
};

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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bGVzaGlwLy4vc3JjL0JhdHRsZXNoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9Cb2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL0Rpc3BsYXkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9EaXNwbGF5Qm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9QbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9TaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvU2hpcE5hbWVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvU2hpcHlhcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9TaW1wbGVBSS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQm9hcmQgZnJvbSAnLi9Cb2FyZCc7XG5pbXBvcnQgU2hpcE5hbWVzIGZyb20gJy4vU2hpcE5hbWVzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQmF0dGxlc2hpcChwbGF5ZXIxLCBwbGF5ZXIyKSB7XG4gIGxldCBvYmogPSB7fTtcbiAgbGV0IHNpemUgPSAxMDtcbiAgbGV0IHAxQm9hcmQgPSBCb2FyZChzaXplKTtcbiAgbGV0IHAyQm9hcmQgPSBCb2FyZChzaXplKTtcbiAgbGV0IGlzUDFUdXJuID0gdHJ1ZTtcbiAgbGV0IGlzUDFXaW5uZXIgPSBmYWxzZTtcbiAgb2JqLm9uRHJhdyA9IHt9O1xuICBvYmoub25HYW1lRW5kID0ge307XG5cbiAgbGV0IGlzVmFsaWRHdWVzcyA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgcmV0dXJuIHggPj0gMCAmJiB4IDwgc2l6ZSAmJiB5ID49IDAgJiYgeSA8IHNpemU7XG4gIH07XG5cbiAgb2JqLnBsYWNlU2hpcCA9IGZ1bmN0aW9uIChuYW1lLCB4LCB5LCBob3Jpem9udGFsLCBpc1BsYXllcjEpIHtcbiAgICBpZiAoaXNQbGF5ZXIxICYmIHAxQm9hcmQuaXNWYWxpZFNoaXBQbGFjZW1lbnQobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCkpXG4gICAgICBwMUJvYXJkLnBsYWNlU2hpcChuYW1lLCB4LCB5LCBob3Jpem9udGFsKTtcbiAgICBlbHNlIGlmIChwMkJvYXJkLmlzVmFsaWRTaGlwUGxhY2VtZW50KG5hbWUsIHgsIHksIGhvcml6b250YWwpKVxuICAgICAgcDJCb2FyZC5wbGFjZVNoaXAobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCk7XG4gIH07XG5cbiAgb2JqLmdldFNoaXBJbmZvID0gZnVuY3Rpb24gKG5hbWUsIGlzUGxheWVyMSkge1xuICAgIHJldHVybiBpc1BsYXllcjEgPyBwMUJvYXJkLmdldFNoaXBJbmZvKG5hbWUpIDogcDJCb2FyZC5nZXRTaGlwSW5mbyhuYW1lKTtcbiAgfTtcblxuICBsZXQgbmV4dFR1cm4gPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IG9wcG9uZW50Qm9hcmQgPSBpc1AxVHVybiA/IHAyQm9hcmQgOiBwMUJvYXJkO1xuICAgIGxldCBjdXJyZW50UGxheWVyID0gaXNQMVR1cm4gPyBwbGF5ZXIxIDogcGxheWVyMjtcbiAgICBsZXQgZ3Vlc3MgPSBhd2FpdCBjdXJyZW50UGxheWVyLmdldEd1ZXNzKCk7XG4gICAgaWYgKCFpc1ZhbGlkR3Vlc3MoZ3Vlc3MueCwgZ3Vlc3MueSkpXG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcbiAgICAgICAgYFBsYXllciAke2lzUDFUdXJuID8gJzEnIDogJzInfSBndWVzcyBpcyBpbnZhbGlkLiAoJHtndWVzc30pYFxuICAgICAgKTtcblxuICAgIGxldCBpc0hpdCA9IG9wcG9uZW50Qm9hcmQuaGl0KGd1ZXNzLngsIGd1ZXNzLnkpO1xuICAgIGN1cnJlbnRQbGF5ZXIuc2V0RmVlZGJhY2soaXNIaXQpO1xuICAgIGlmIChvYmoub25EcmF3IGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgIG9iai5vbkRyYXcoKTtcbiAgICB9XG4gICAgaXNQMVR1cm4gPSAhaXNQMVR1cm47XG4gICAgaWYgKE9iamVjdC52YWx1ZXMoU2hpcE5hbWVzKS5ldmVyeSgobmFtZSkgPT4gb3Bwb25lbnRCb2FyZC5pc1N1bmsobmFtZSkpKSB7XG4gICAgICBpc1AxV2lubmVyID0gIWlzUDFUdXJuO1xuICAgICAgaWYgKG9iai5vbkdhbWVFbmQgaW5zdGFuY2VvZiBGdW5jdGlvbikgb2JqLm9uR2FtZUVuZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXh0VHVybigpO1xuICAgIH1cbiAgfTtcblxuICBvYmouaXNQMVR1cm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGlzUDFUdXJuO1xuICB9O1xuXG4gIG9iai5pc1AxV2lubmVyID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBpc1AxV2lubmVyO1xuICB9O1xuXG4gIG9iai5zdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpc1AxVHVybiA9IHRydWU7XG4gICAgbmV4dFR1cm4oKTtcbiAgfTtcblxuICBvYmoucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaXNQMVR1cm4gPSB0cnVlO1xuICAgIGlzUDFXaW5uZXIgPSBmYWxzZTtcbiAgICBwMUJvYXJkLnJlc2V0KCk7XG4gICAgcDJCb2FyZC5yZXNldCgpO1xuICAgIHBsYXllcjEucmVzZXQoKTtcbiAgICBwbGF5ZXIyLnJlc2V0KCk7XG4gIH07XG4gIHJldHVybiBvYmo7XG59XG4iLCJpbXBvcnQgU2hpcCBmcm9tICcuL1NoaXAnO1xuaW1wb3J0IFNoaXBOYW1lcyBmcm9tICcuL1NoaXBOYW1lcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJvYXJkKHNpemUpIHtcbiAgbGV0IHNoaXBzID0ge307XG4gIHNoaXBzW1NoaXBOYW1lcy5DYXJyaWVyXSA9IFNoaXAoNSk7XG4gIHNoaXBzW1NoaXBOYW1lcy5CYXR0bGVzaGlwXSA9IFNoaXAoNCk7XG4gIHNoaXBzW1NoaXBOYW1lcy5EZXN0cm95ZXJdID0gU2hpcCgzKTtcbiAgc2hpcHNbU2hpcE5hbWVzLlN1Ym1hcmluZV0gPSBTaGlwKDMpO1xuICBzaGlwc1tTaGlwTmFtZXMuUGF0cm9sQm9hdF0gPSBTaGlwKDIpO1xuICBsZXQgcGxhY2VkU2hpcHMgPSBbXTtcbiAgbGV0IHZhbGlkYXRlU2hpcEluZm8gPSBmdW5jdGlvbiAobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCkge1xuICAgIGlmIChzaGlwc1tuYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvcjogbmFtZSBtdXN0IGJlIGEgdmFsaWQgc2hpcCBuYW1lJyk7XG4gICAgaWYgKHggPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcigneCBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB6ZXJvJyk7XG4gICAgaWYgKHkgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcigneSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB6ZXJvJyk7XG4gICAgaWYgKGhvcml6b250YWwgJiYgeCArIHNoaXBzW25hbWVdLmdldExlbmd0aCgpIC0gMSA+PSBzaXplKVxuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXG4gICAgICAgIGB4ICR7XG4gICAgICAgICAgeCArIHNoaXBzW25hbWVdLmdldExlbmd0aCgpIC0gMVxuICAgICAgICB9IG11c3QgYmUgbGVzcyB0aGFuIHRoZSBzaXplIG9mIHRoZSBib2FyZCAoJHtzaXplfSlgXG4gICAgICApO1xuICAgIGlmICghaG9yaXpvbnRhbCAmJiB5ICsgc2hpcHNbbmFtZV0uZ2V0TGVuZ3RoKCkgLSAxID49IHNpemUpXG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcbiAgICAgICAgYHkgKCR7XG4gICAgICAgICAgeSArIHNoaXBzW25hbWVdLmdldExlbmd0aCgpIC0gMVxuICAgICAgICB9KSBtdXN0IGJlIGxlc3MgdGhhbiB0aGUgc2l6ZSBvZiB0aGUgYm9hcmQgKCR7c2l6ZX0pYFxuICAgICAgKTtcbiAgfTtcblxuICBsZXQgaXNWYWxpZFNoaXBQbGFjZW1lbnQgPSBmdW5jdGlvbiAobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCkge1xuICAgIGlmIChzaGlwc1tuYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvcjogbmFtZSBtdXN0IGJlIGEgdmFsaWQgc2hpcCBuYW1lJyk7XG4gICAgbGV0IGxlZnQgPSB4O1xuICAgIGxldCB0b3AgPSB5O1xuICAgIGxldCByaWdodCA9IGhvcml6b250YWwgPyBsZWZ0ICsgc2hpcHNbbmFtZV0uZ2V0TGVuZ3RoKCkgLSAxIDogbGVmdDtcbiAgICBsZXQgYm90dG9tID0gaG9yaXpvbnRhbCA/IHRvcCA6IHRvcCArIHNoaXBzW25hbWVdLmdldExlbmd0aCgpIC0gMTtcbiAgICBpZiAobGVmdCA8IDAgfHwgcmlnaHQgPCAwIHx8IHJpZ2h0ID49IHNpemUgfHwgYm90dG9tID49IHNpemUpIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiAhcGxhY2VkU2hpcHMuc29tZSgodmFsKSA9PiB7XG4gICAgICBpZiAodmFsICE9PSBuYW1lKSB7XG4gICAgICAgIGxldCBsID0gc2hpcHNbdmFsXS5nZXRPcmlnaW4oKS54O1xuICAgICAgICBsZXQgdCA9IHNoaXBzW3ZhbF0uZ2V0T3JpZ2luKCkueTtcbiAgICAgICAgbGV0IHIgPSBzaGlwc1t2YWxdLmlzSG9yaXpvbnRhbCgpID8gbCArIHNoaXBzW3ZhbF0uZ2V0TGVuZ3RoKCkgLSAxIDogbDtcbiAgICAgICAgbGV0IGIgPSBzaGlwc1t2YWxdLmlzSG9yaXpvbnRhbCgpID8gdCA6IHQgKyBzaGlwc1t2YWxdLmdldExlbmd0aCgpIC0gMTtcbiAgICAgICAgLy8gc2hpcHMgY29sbGlkZVxuICAgICAgICBpZiAoXG4gICAgICAgICAgKChsZWZ0ID49IGwgJiYgbGVmdCA8PSByKSB8fCAocmlnaHQgPj0gbCAmJiByaWdodCA8PSByKSkgJiZcbiAgICAgICAgICAoKHRvcCA+PSB0ICYmIHRvcCA8PSBiKSB8fCAoYm90dG9tID49IHQgJiYgYm90dG9tIDw9IGIpKVxuICAgICAgICApIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGxldCBwbGFjZVNoaXAgPSBmdW5jdGlvbiAobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCkge1xuICAgIHZhbGlkYXRlU2hpcEluZm8obmFtZSwgeCwgeSwgaG9yaXpvbnRhbCk7XG4gICAgaWYgKCFpc1ZhbGlkU2hpcFBsYWNlbWVudChuYW1lLCB4LCB5LCBob3Jpem9udGFsKSkgcmV0dXJuIGZhbHNlO1xuICAgIHNoaXBzW25hbWVdLnNldE9yaWdpbih4LCB5KTtcbiAgICBzaGlwc1tuYW1lXS5zZXRIb3Jpem9udGFsKGhvcml6b250YWwpO1xuICAgIGlmICghcGxhY2VkU2hpcHMuaW5jbHVkZXMobmFtZSkpIHBsYWNlZFNoaXBzLnB1c2gobmFtZSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgbGV0IHJlbW92ZVNoaXAgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIGlmIChzaGlwc1tuYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvcjogbmFtZSBtdXN0IGJlIGEgdmFsaWQgc2hpcCBuYW1lJyk7XG4gICAgcGxhY2VkU2hpcHMgPSBwbGFjZWRTaGlwcy5maWx0ZXIoKHYpID0+IHYgIT09IG5hbWUpO1xuICAgIHNoaXBzW25hbWVdLnJlc2V0SGl0cygpO1xuICB9O1xuXG4gIGxldCBoaXQgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgIGZvciAoY29uc3QgbmFtZSBpbiBzaGlwcykge1xuICAgICAgaWYgKHBsYWNlZFNoaXBzLmluY2x1ZGVzKG5hbWUpICYmIHNoaXBzW25hbWVdLmhpdCh4LCB5KSkgcmV0dXJuIG5hbWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBsZXQgaXNTdW5rID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBpZiAoc2hpcHNbbmFtZV0gPT09IHVuZGVmaW5lZClcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3I6IG5hbWUgbXVzdCBiZSBhIHZhbGlkIHNoaXAgbmFtZScpO1xuICAgIHJldHVybiBzaGlwc1tuYW1lXS5pc1N1bmsoKTtcbiAgfTtcblxuICBsZXQgZ2V0U2hpcEluZm8gPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIGlmIChzaGlwc1tuYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvcjogbmFtZSBtdXN0IGJlIGEgdmFsaWQgc2hpcCBuYW1lJyk7XG4gICAgaWYgKCFwbGFjZWRTaGlwcy5pbmNsdWRlcyhuYW1lKSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICByZXR1cm4ge1xuICAgICAgb3JpZ2luOiBzaGlwc1tuYW1lXS5nZXRPcmlnaW4oKSxcbiAgICAgIGhvcml6b250YWw6IHNoaXBzW25hbWVdLmlzSG9yaXpvbnRhbCgpLFxuICAgICAgc3Vuazogc2hpcHNbbmFtZV0uaXNTdW5rKCksXG4gICAgICBsZW5ndGg6IHNoaXBzW25hbWVdLmdldExlbmd0aCgpLFxuICAgIH07XG4gIH07XG5cbiAgbGV0IHJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIGZvciAoY29uc3QgbmFtZSBpbiBTaGlwTmFtZXMpIHtcbiAgICAgIHJlbW92ZVNoaXAobmFtZSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgcGxhY2VTaGlwLFxuICAgIHJlbW92ZVNoaXAsXG4gICAgaGl0LFxuICAgIGlzU3VuayxcbiAgICBnZXRTaGlwSW5mbyxcbiAgICBpc1ZhbGlkU2hpcFBsYWNlbWVudCxcbiAgICByZXNldCxcbiAgfTtcbn1cbiIsImltcG9ydCBEaXNwbGF5Qm9hcmQgZnJvbSAnLi9EaXNwbGF5Qm9hcmQnO1xuaW1wb3J0IFNoaXBOYW1lcyBmcm9tICcuL1NoaXBOYW1lcyc7XG5pbXBvcnQgU2hpcHlhcmQgZnJvbSAnLi9TaGlweWFyZCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIERpc3BsYXkoYmF0dGxlc2hpcCwgcGxheWVyLCBvcHBvbmVudCwgY29udGFpbmVyKSB7XG4gIGxldCBvcHBvbmVudERpc3BsYXkgPSBEaXNwbGF5Qm9hcmQoY29udGFpbmVyLCAnb3Bwb25lbnQnKTtcbiAgb3Bwb25lbnREaXNwbGF5LmFsbG93U2hpcFBsYWNlbWVudChmYWxzZSk7XG4gIGxldCBwbGF5ZXJEaXNwbGF5ID0gRGlzcGxheUJvYXJkKGNvbnRhaW5lciwgJ3BsYXllcicpO1xuICBsZXQgc2hpcHlhcmQgPSBTaGlweWFyZChjb250YWluZXIsICdwbGF5ZXInKTtcbiAgcGxheWVyRGlzcGxheS5hbGxvd1NoaXBQbGFjZW1lbnQodHJ1ZSk7XG4gIGxldCBzdGFydCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICBsZXQgaW5mbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBsZXQgcmVzZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcblxuICBsZXQgaXNBbGxTaGlwc1BsYWNlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoU2hpcE5hbWVzKS5ldmVyeShcbiAgICAgIChuYW1lKSA9PiBiYXR0bGVzaGlwLmdldFNoaXBJbmZvKG5hbWUsIHRydWUpICE9PSB1bmRlZmluZWRcbiAgICApO1xuICB9O1xuXG4gIGxldCBzZXR1cFNoaXBQbGFjZW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcGxheWVyRGlzcGxheS5vbkNlbGxEcm9wID0gKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGxldCBpbmZvID0gSlNPTi5wYXJzZShlLmRhdGFUcmFuc2Zlci5nZXREYXRhKCd0ZXh0JykpO1xuICAgICAgbGV0IG9yaWdpbiA9IHBsYXllckRpc3BsYXkuY2VsbEZyb21Qb2ludChcbiAgICAgICAgZS54IC0gZS5vZmZzZXRYIC0gaW5mby5vZmZzZXRYICsgMjUsXG4gICAgICAgIGUueSAtIGUub2Zmc2V0WSAtIGluZm8ub2Zmc2V0WSArIDI1XG4gICAgICApO1xuICAgICAgaWYgKG9yaWdpbiAhPT0gdW5kZWZpbmVkKVxuICAgICAgICBiYXR0bGVzaGlwLnBsYWNlU2hpcChcbiAgICAgICAgICBpbmZvLm5hbWUsXG4gICAgICAgICAgb3JpZ2luLngsXG4gICAgICAgICAgb3JpZ2luLnksXG4gICAgICAgICAgaW5mby5ob3Jpem9udGFsLFxuICAgICAgICAgIHRydWVcbiAgICAgICAgKTtcbiAgICAgIHBsYXllckRpc3BsYXkuZHJhd1NoaXAoXG4gICAgICAgIGluZm8ubmFtZSxcbiAgICAgICAgYmF0dGxlc2hpcC5nZXRTaGlwSW5mbyhpbmZvLm5hbWUsIHRydWUpXG4gICAgICApO1xuICAgICAgaWYgKGlzQWxsU2hpcHNQbGFjZWQoKSkgc3RhcnQuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9O1xuICB9O1xuICBsZXQgc2V0dXBHdWVzc2luZyA9IGZ1bmN0aW9uICgpIHtcbiAgICBvcHBvbmVudERpc3BsYXkub25DZWxsQ2xpY2sgPSAoZSkgPT4ge1xuICAgICAgbGV0IG9yaWdpbiA9IG9wcG9uZW50RGlzcGxheS5jZWxsRnJvbVBvaW50KFxuICAgICAgICBlLnggLSBlLm9mZnNldFgsXG4gICAgICAgIGUueSAtIGUub2Zmc2V0WVxuICAgICAgKTtcbiAgICAgIHBsYXllci5zZXRHdWVzcyhvcmlnaW4ueCwgb3JpZ2luLnkpO1xuICAgIH07XG4gIH07XG5cbiAgbGV0IHNldHVwU2hpcHlhcmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgc2hpcHlhcmQub25TaGlwRHJhZ1N0YXJ0ID0gKGUsIG5hbWUpID0+IHtcbiAgICAgIGxldCBpbmZvID0gYmF0dGxlc2hpcC5nZXRTaGlwSW5mbyhuYW1lLCB0cnVlKTtcbiAgICAgIGxldCBob3Jpem9udGFsID0gaW5mbyA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBpbmZvLmhvcml6b250YWw7XG4gICAgICBlLmRhdGFUcmFuc2Zlci5zZXREYXRhKFxuICAgICAgICAndGV4dCcsXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgIG9mZnNldFg6IGUub2Zmc2V0WCxcbiAgICAgICAgICBvZmZzZXRZOiBlLm9mZnNldFksXG4gICAgICAgICAgaG9yaXpvbnRhbDogaG9yaXpvbnRhbCxcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfTtcbiAgICBzaGlweWFyZC5vblNoaXBDbGljayA9IChlLCBuYW1lKSA9PiB7XG4gICAgICBsZXQgaW5mbyA9IGJhdHRsZXNoaXAuZ2V0U2hpcEluZm8obmFtZSwgdHJ1ZSk7XG4gICAgICBpZiAoaW5mbyA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG4gICAgICBiYXR0bGVzaGlwLnBsYWNlU2hpcChcbiAgICAgICAgbmFtZSxcbiAgICAgICAgaW5mby5vcmlnaW4ueCxcbiAgICAgICAgaW5mby5vcmlnaW4ueSxcbiAgICAgICAgIWluZm8uaG9yaXpvbnRhbCxcbiAgICAgICAgdHJ1ZVxuICAgICAgKTtcbiAgICAgIHBsYXllckRpc3BsYXkuZHJhd1NoaXAobmFtZSwgYmF0dGxlc2hpcC5nZXRTaGlwSW5mbyhuYW1lLCB0cnVlKSk7XG4gICAgfTtcbiAgfTtcblxuICBsZXQgc2V0dXBTdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgc3RhcnREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBzdGFydERpdi5jbGFzc0xpc3QuYWRkKCdzdGFydERpdicpO1xuICAgIHN0YXJ0LmNsYXNzTGlzdC5hZGQoJ3N0YXJ0Jyk7XG4gICAgc3RhcnQuZGlzYWJsZWQgPSB0cnVlO1xuICAgIHN0YXJ0LnRleHRDb250ZW50ID0gJ1N0YXJ0IEdhbWUnO1xuICAgIHN0YXJ0Lm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IG5hbWUgaW4gU2hpcE5hbWVzKSB7XG4gICAgICAgIGxldCBwb3MgPSBvcHBvbmVudC5nZXRTaGlwUG9zaXRpb24obmFtZSk7XG4gICAgICAgIGJhdHRsZXNoaXAucGxhY2VTaGlwKG5hbWUsIHBvcy54LCBwb3MueSwgcG9zLmhvcml6b250YWwsIGZhbHNlKTtcbiAgICAgIH1cbiAgICAgIHBsYXllckRpc3BsYXkuYWxsb3dTaGlwUGxhY2VtZW50KGZhbHNlKTtcbiAgICAgIGJhdHRsZXNoaXAuc3RhcnQoKTtcbiAgICAgIHN0YXJ0LmNsYXNzTGlzdC5hZGQoJ2ludmlzaWJsZScpO1xuICAgICAgaW5mby50ZXh0Q29udGVudCA9ICdNYWtlIHlvdXIgZ3Vlc3MhJztcbiAgICB9O1xuICAgIHN0YXJ0RGl2LmFwcGVuZENoaWxkKHN0YXJ0KTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoc3RhcnREaXYpO1xuICB9O1xuXG4gIGxldCBzZXR1cEluZm8gPSBmdW5jdGlvbiAoKSB7XG4gICAgaW5mby5jbGFzc0xpc3QuYWRkKCdpbmZvJyk7XG4gICAgaW5mby50ZXh0Q29udGVudCA9ICdQbGFjZSB5b3VyIHNoaXBzISc7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGluZm8pO1xuICB9O1xuXG4gIGxldCBzZXR1cFJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJlc2V0LmNsYXNzTGlzdC5hZGQoJ3Jlc2V0Jyk7XG4gICAgcmVzZXQuY2xhc3NMaXN0LmFkZCgnaW52aXNpYmxlJyk7XG4gICAgcmVzZXQudGV4dENvbnRlbnQgPSAnUGxheSBBZ2Fpbic7XG4gICAgcmVzZXQub25jbGljayA9ICgpID0+IHtcbiAgICAgIHNoaXB5YXJkLnJlc2V0KCk7XG4gICAgICBvcHBvbmVudERpc3BsYXkucmVzZXQoKTtcbiAgICAgIHBsYXllckRpc3BsYXkucmVzZXQoKTtcbiAgICAgIGJhdHRsZXNoaXAucmVzZXQoKTtcbiAgICAgIHJlc2V0LmNsYXNzTGlzdC5hZGQoJ2ludmlzaWJsZScpO1xuICAgICAgc3RhcnQuY2xhc3NMaXN0LnJlbW92ZSgnaW52aXNpYmxlJyk7XG4gICAgICBzdGFydC5kaXNhYmxlZCA9IHRydWU7XG4gICAgICBpbmZvLnRleHRDb250ZW50ID0gJ1BsYWNlIHlvdXIgc2hpcHMhJztcbiAgICB9O1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChyZXNldCk7XG4gIH07XG5cbiAgbGV0IGRyYXdTaGlwcyA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gU2hpcE5hbWVzKSB7XG4gICAgICBwbGF5ZXJEaXNwbGF5LmRyYXdTaGlwKG5hbWUsIGJhdHRsZXNoaXAuZ2V0U2hpcEluZm8obmFtZSwgdHJ1ZSkpO1xuICAgIH1cbiAgfTtcblxuICBsZXQgZHJhd0d1ZXNzZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcGxheWVyLmdldEhpc3RvcnkoKS5mb3JFYWNoKChlKSA9PiB7XG4gICAgICBvcHBvbmVudERpc3BsYXkuZHJhd0d1ZXNzKGUueCwgZS55LCBlLmlzSGl0KTtcbiAgICB9KTtcblxuICAgIG9wcG9uZW50LmdldEhpc3RvcnkoKS5mb3JFYWNoKChlKSA9PiB7XG4gICAgICBwbGF5ZXJEaXNwbGF5LmRyYXdHdWVzcyhlLngsIGUueSwgZS5pc0hpdCk7XG4gICAgfSk7XG4gIH07XG5cbiAgbGV0IGRyYXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgZHJhd1NoaXBzKCk7XG4gICAgZHJhd0d1ZXNzZXMoKTtcbiAgICBpZiAoIWJhdHRsZXNoaXAuaXNQMVR1cm4oKSkge1xuICAgICAgbGV0IHBsYXllckhpc3RvcnkgPSBwbGF5ZXIuZ2V0SGlzdG9yeSgpO1xuICAgICAgbGV0IHBsYXllckd1ZXNzID0gcGxheWVySGlzdG9yeVtwbGF5ZXJIaXN0b3J5Lmxlbmd0aCAtIDFdO1xuICAgICAgbGV0IG9wcG9uZW50SGlzdG9yeSA9IG9wcG9uZW50LmdldEhpc3RvcnkoKTtcbiAgICAgIGxldCBvcHBvbmVudEd1ZXNzID0gb3Bwb25lbnRIaXN0b3J5W29wcG9uZW50SGlzdG9yeS5sZW5ndGggLSAxXTtcbiAgICAgIGluZm8udGV4dENvbnRlbnQgPSBgJHtwbGF5ZXJHdWVzcy5pc0hpdCA/ICdIaXQnIDogJ01pc3MnfSFcbiAgICAgICAgT3Bwb25lbnQgJHtvcHBvbmVudEd1ZXNzLmlzSGl0ID8gJ2hpdCcgOiAnbWlzc2VkJ30hXG4gICAgICAgIEd1ZXNzIGFnYWluIWA7XG4gICAgfVxuICB9O1xuXG4gIGxldCBlbmRHYW1lID0gZnVuY3Rpb24gKCkge1xuICAgIGluZm8udGV4dENvbnRlbnQgPSBgJHtiYXR0bGVzaGlwLmlzUDFXaW5uZXIoKSA/ICdQbGF5ZXInIDogJ09wcG9uZW50J31cbiAgICAgIHdpbnMhIEFsbCBzaGlwcyBzdW5rISBQbGF5IGFnYWluP2A7XG4gICAgcmVzZXQuY2xhc3NMaXN0LnJlbW92ZSgnaW52aXNpYmxlJyk7XG4gIH07XG5cbiAgbGV0IHNldHVwID0gZnVuY3Rpb24gKCkge1xuICAgIHNldHVwU2hpcFBsYWNlbWVudCgpO1xuICAgIHNldHVwR3Vlc3NpbmcoKTtcbiAgICBzZXR1cFNoaXB5YXJkKCk7XG4gICAgc2V0dXBTdGFydCgpO1xuICAgIHNldHVwSW5mbygpO1xuICAgIHNldHVwUmVzZXQoKTtcbiAgfTtcblxuICBzZXR1cCgpO1xuICByZXR1cm4geyBkcmF3LCBlbmRHYW1lIH07XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBEaXNwbGF5Qm9hcmQoY29udGFpbmVyLCBuYW1lKSB7XG4gIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGl2LmNsYXNzTGlzdC5hZGQoJ2JvYXJkJyk7XG4gIGxldCBpbWFnZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBpbWFnZURpdi5jbGFzc0xpc3QuYWRkKCdncmlkJyk7XG4gIGRpdi5hcHBlbmRDaGlsZChpbWFnZURpdik7XG5cbiAgbGV0IGRpc3BsYXlCb2FyZCA9IHt9O1xuICBkaXNwbGF5Qm9hcmQub25DZWxsRHJvcCA9IHt9O1xuICBkaXNwbGF5Qm9hcmQub25DZWxsQ2xpY2sgPSB7fTtcbiAgZGlzcGxheUJvYXJkLmNlbGxGcm9tUG9pbnQgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgIGxldCBjZWxsID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludCh4LCB5KTtcbiAgICBpZiAoY2VsbC5jbGFzc0xpc3QuY29udGFpbnMoJ2NlbGwnKSAmJiBkaXYuY29udGFpbnMoY2VsbCkpXG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShjZWxsLmlkKTtcbiAgICBlbHNlIHJldHVybiB1bmRlZmluZWQ7XG4gIH07XG5cbiAgZGlzcGxheUJvYXJkLmFsbG93U2hpcFBsYWNlbWVudCA9IGZ1bmN0aW9uIChhbGxvdykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGl2LmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgY2VsbCA9IGRpdi5jaGlsZHJlbltpXTtcbiAgICAgIGlmIChjZWxsLmNsYXNzTGlzdC5jb250YWlucygnY2VsbCcpICYmIGRpdi5jb250YWlucyhjZWxsKSkge1xuICAgICAgICBpZiAoYWxsb3cpIGNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnY2VsbEZvcndhcmQnKTtcbiAgICAgICAgZWxzZSBjZWxsLmNsYXNzTGlzdC5hZGQoJ2NlbGxGb3J3YXJkJyk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGRpc3BsYXlCb2FyZC5kcmF3U2hpcCA9IGZ1bmN0aW9uIChzaGlwTmFtZSwgaW5mbykge1xuICAgIGlmIChpbmZvICE9IHVuZGVmaW5lZCkge1xuICAgICAgbGV0IHNoaXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYW1lICsgc2hpcE5hbWUpO1xuICAgICAgbGV0IHJpZ2h0ID0gaW5mby5vcmlnaW4ueCArIDM7XG4gICAgICBsZXQgYm90dG9tID0gaW5mby5vcmlnaW4ueSArIDM7XG4gICAgICBpZiAoaW5mby5ob3Jpem9udGFsKSB7XG4gICAgICAgIHJpZ2h0ICs9IGluZm8ubGVuZ3RoIC0gMTtcbiAgICAgICAgc2hpcC5jbGFzc0xpc3QucmVtb3ZlKCd2ZXJ0aWNhbFNoaXAnKTtcbiAgICAgICAgc2hpcC5jbGFzc0xpc3QuYWRkKCdob3Jpem9udGFsU2hpcCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYm90dG9tICs9IGluZm8ubGVuZ3RoIC0gMTtcbiAgICAgICAgc2hpcC5jbGFzc0xpc3QucmVtb3ZlKCdob3Jpem9udGFsU2hpcCcpO1xuICAgICAgICBzaGlwLmNsYXNzTGlzdC5hZGQoJ3ZlcnRpY2FsU2hpcCcpO1xuICAgICAgfVxuICAgICAgc2hpcC5zdHlsZS5ncmlkQXJlYSA9IGBcbiAgICAgICAgICAgICR7aW5mby5vcmlnaW4ueSArIDJ9IC9cbiAgICAgICAgICAgICR7aW5mby5vcmlnaW4ueCArIDJ9IC9cbiAgICAgICAgICAgICR7Ym90dG9tfSAvXG4gICAgICAgICAgICAke3JpZ2h0fWA7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoc2hpcCk7XG4gICAgfVxuICB9O1xuXG4gIGRpc3BsYXlCb2FyZC5kcmF3R3Vlc3MgPSBmdW5jdGlvbiAoeCwgeSwgaXNIaXQpIHtcbiAgICBsZXQgY2VsbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEpTT04uc3RyaW5naWZ5KHsgbmFtZSwgeCwgeSB9KSk7XG4gICAgY2VsbC50ZXh0Q29udGVudCA9IGlzSGl0ID8gJ1gnIDogJzAnO1xuICB9O1xuXG4gIGRpc3BsYXlCb2FyZC5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRpdi5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGNlbGwgPSBkaXYuY2hpbGRyZW5baV07XG4gICAgICBpZiAoY2VsbC5jbGFzc0xpc3QuY29udGFpbnMoJ2NlbGwnKSAmJiBkaXYuY29udGFpbnMoY2VsbCkpIHtcbiAgICAgICAgY2VsbC50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ2NlbGxGb3J3YXJkJyk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGxldCBzZXR1cENlbGxzID0gZnVuY3Rpb24gKCkge1xuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgMTE7IHkrKykge1xuICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCAxMTsgeCsrKSB7XG4gICAgICAgIGxldCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGNlbGwuaWQgPSBKU09OLnN0cmluZ2lmeSh7IG5hbWUsIHg6IHggLSAxLCB5OiB5IC0gMSB9KTtcbiAgICAgICAgY2VsbC5zdHlsZS5ncmlkQXJlYSA9IGAke3kgKyAxfSAvICR7eCArIDF9IC8gJHt5ICsgMn0gLyAke3ggKyAyfWA7XG4gICAgICAgIGlmICh5ID09PSAwICYmIHggPiAwKSB7XG4gICAgICAgICAgY2VsbC50ZXh0Q29udGVudCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoNjQgKyB4KTtcbiAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ2xhYmVsQ2VsbCcpO1xuICAgICAgICB9IGVsc2UgaWYgKHggPT09IDAgJiYgeSA+IDApIHtcbiAgICAgICAgICBjZWxsLnRleHRDb250ZW50ID0geS50b1N0cmluZygpO1xuICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnbGFiZWxDZWxsJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoeCA+IDAgJiYgeSA+IDApIHtcbiAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ2NlbGwnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNlbGwub25kcmFnb3ZlciA9IChlKSA9PiBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNlbGwub25kcm9wID0gKGUpID0+IHtcbiAgICAgICAgICBpZiAoZGlzcGxheUJvYXJkLm9uQ2VsbERyb3AgaW5zdGFuY2VvZiBGdW5jdGlvbilcbiAgICAgICAgICAgIGRpc3BsYXlCb2FyZC5vbkNlbGxEcm9wKGUsIHggKyAxLCB5ICsgMSk7XG4gICAgICAgIH07XG4gICAgICAgIGNlbGwub25jbGljayA9IChlKSA9PiB7XG4gICAgICAgICAgaWYgKGRpc3BsYXlCb2FyZC5vbkNlbGxDbGljayBpbnN0YW5jZW9mIEZ1bmN0aW9uKVxuICAgICAgICAgICAgZGlzcGxheUJvYXJkLm9uQ2VsbENsaWNrKGUsIHggKyAxLCB5ICsgMSk7XG4gICAgICAgIH07XG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChjZWxsKTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRpdik7XG4gIH07XG5cbiAgc2V0dXBDZWxscygpO1xuICByZXR1cm4gZGlzcGxheUJvYXJkO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUGxheWVyKCkge1xuICBsZXQgZ3Vlc3MgPSB1bmRlZmluZWQ7XG4gIGxldCBoaXN0b3J5ID0gW107XG5cbiAgbGV0IGdldEd1ZXNzID0gYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgIHdoaWxlIChndWVzcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHJlc29sdmUoKSwgNTApO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGxldCByZXQgPSB7IHg6IGd1ZXNzLngsIHk6IGd1ZXNzLnksIGlzSGl0OiBmYWxzZSB9O1xuICAgIGhpc3RvcnkucHVzaChyZXQpO1xuICAgIGd1ZXNzID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiByZXQ7XG4gIH07XG5cbiAgbGV0IHNldEd1ZXNzID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICBsZXQgYXR0ZW1wdCA9IHsgeDogeCwgeTogeSB9O1xuICAgIGlmIChoaXN0b3J5LmZpbmQoKHYpID0+IHYueCA9PT0gYXR0ZW1wdC54ICYmIHYueSA9PT0gYXR0ZW1wdC55KSkgcmV0dXJuO1xuICAgIGd1ZXNzID0gYXR0ZW1wdDtcbiAgfTtcblxuICBsZXQgc2V0RmVlZGJhY2sgPSBmdW5jdGlvbiAoaXNIaXQpIHtcbiAgICBoaXN0b3J5W2hpc3RvcnkubGVuZ3RoIC0gMV0uaXNIaXQgPSBpc0hpdDtcbiAgfTtcblxuICBsZXQgZ2V0SGlzdG9yeSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gWy4uLmhpc3RvcnldO1xuICB9O1xuXG4gIGxldCByZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICBndWVzcyA9IHVuZGVmaW5lZDtcbiAgICBoaXN0b3J5ID0gW107XG4gIH07XG5cbiAgcmV0dXJuIHsgZ2V0R3Vlc3MsIHNldEd1ZXNzLCBnZXRIaXN0b3J5LCBzZXRGZWVkYmFjaywgcmVzZXQgfTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNoaXAobGVuZ3RoKSB7XG4gIGlmICghTnVtYmVyLmlzSW50ZWdlcihsZW5ndGgpKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2xlbmd0aCBtdXN0IGJlIGFuIGludGVnZXInKTtcbiAgZWxzZSBpZiAobGVuZ3RoIDwgMClcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignU2hpcCBsZW5ndGggY2Fubm90IGJlIGxlc3MgdGhhbiB6ZXJvJyk7XG4gIGxldCB4ID0gMDtcbiAgbGV0IHkgPSAwO1xuICBsZXQgaG9yaXpvbnRhbCA9IGZhbHNlO1xuICBsZXQgaGl0cyA9IFtdO1xuXG4gIGxldCBnZXRMZW5ndGggPSAoKSA9PiB7XG4gICAgcmV0dXJuIGxlbmd0aDtcbiAgfTtcblxuICBsZXQgc2V0T3JpZ2luID0gKG5ld1gsIG5ld1kpID0+IHtcbiAgICBpZiAoIU51bWJlci5pc0ludGVnZXIobmV3WCkpIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ggbXVzdCBiZSBhbiBpbnRlZ2VyJyk7XG4gICAgZWxzZSBpZiAoIU51bWJlci5pc0ludGVnZXIobmV3WSkpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd5IG11c3QgYmUgYW4gaW50ZWdlcicpO1xuXG4gICAgeCA9IG5ld1g7XG4gICAgeSA9IG5ld1k7XG4gIH07XG5cbiAgbGV0IGdldE9yaWdpbiA9ICgpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgeCxcbiAgICAgIHksXG4gICAgfTtcbiAgfTtcblxuICBsZXQgaXNIb3Jpem9udGFsID0gKCkgPT4ge1xuICAgIHJldHVybiBob3Jpem9udGFsO1xuICB9O1xuXG4gIGxldCBzZXRIb3Jpem9udGFsID0gKHZhbHVlKSA9PiB7XG4gICAgaG9yaXpvbnRhbCA9ICEhdmFsdWU7XG4gIH07XG5cbiAgbGV0IGhpdCA9ICh0YXJnZXRYLCB0YXJnZXRZKSA9PiB7XG4gICAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKHRhcmdldFgpKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndGFyZ2V0WCBtdXN0IGJlIGFuIGludGVnZXInKTtcbiAgICBlbHNlIGlmICghTnVtYmVyLmlzSW50ZWdlcih0YXJnZXRZKSlcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3RhcmdldFkgbXVzdCBiZSBhbiBpbnRlZ2VyJyk7XG5cbiAgICBsZXQgc3VjY2VzcyA9XG4gICAgICAoaG9yaXpvbnRhbCAmJiB5ID09PSB0YXJnZXRZICYmIHRhcmdldFggPj0geCAmJiB0YXJnZXRYIDwgeCArIGxlbmd0aCkgfHxcbiAgICAgICghaG9yaXpvbnRhbCAmJiB4ID09PSB0YXJnZXRYICYmIHRhcmdldFkgPj0geSAmJiB0YXJnZXRZIDwgeSArIGxlbmd0aCk7XG4gICAgaWYgKHN1Y2Nlc3MpIGhpdHMucHVzaCh7IHg6IHRhcmdldFgsIHk6IHRhcmdldFkgfSk7XG4gICAgcmV0dXJuIHN1Y2Nlc3M7XG4gIH07XG5cbiAgbGV0IGlzU3VuayA9ICgpID0+IHtcbiAgICBpZiAoaGl0cy5sZW5ndGggPT09IDApIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gKFxuICAgICAgaGl0cy5sZW5ndGggPT09IGxlbmd0aCAmJlxuICAgICAgaGl0cy5ldmVyeSgodikgPT4ge1xuICAgICAgICBpZiAoaG9yaXpvbnRhbCkgcmV0dXJuIHYueSA9PT0geSAmJiB2LnggPj0geCAmJiB2LnggPCB4ICsgbGVuZ3RoO1xuICAgICAgICBlbHNlIHJldHVybiB2LnggPT09IHggJiYgdi55ID49IHkgJiYgdi55IDwgeSArIGxlbmd0aDtcbiAgICAgIH0pXG4gICAgKTtcbiAgfTtcblxuICBsZXQgcmVzZXRIaXRzID0gKCkgPT4gKGhpdHMubGVuZ3RoID0gMCk7XG4gIHJldHVybiB7XG4gICAgZ2V0TGVuZ3RoLFxuICAgIGdldE9yaWdpbixcbiAgICBzZXRPcmlnaW4sXG4gICAgaXNIb3Jpem9udGFsLFxuICAgIHNldEhvcml6b250YWwsXG4gICAgaGl0LFxuICAgIGlzU3VuayxcbiAgICByZXNldEhpdHMsXG4gIH07XG59XG4iLCJleHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24gU2hpcE5hbWVzKCkge1xuICByZXR1cm4ge1xuICAgIENhcnJpZXI6ICdDYXJyaWVyJyxcbiAgICBCYXR0bGVzaGlwOiAnQmF0dGxlc2hpcCcsXG4gICAgRGVzdHJveWVyOiAnRGVzdHJveWVyJyxcbiAgICBTdWJtYXJpbmU6ICdTdWJtYXJpbmUnLFxuICAgIFBhdHJvbEJvYXQ6ICdQYXRyb2xCb2F0JyxcbiAgfTtcbn0pKCk7XG4iLCJpbXBvcnQgU2hpcE5hbWVzIGZyb20gJy4vU2hpcE5hbWVzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2hpcHlhcmQoY29udGFpbmVyLCBuYW1lKSB7XG4gIGxldCBzaGlweWFyZCA9IHt9O1xuICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdi5jbGFzc0xpc3QuYWRkKG5hbWUgKyAnc2hpcHlhcmQnKTtcbiAgc2hpcHlhcmQub25TaGlwQ2xpY2sgPSB7fTtcbiAgc2hpcHlhcmQub25TaGlwRHJhZ1N0YXJ0ID0ge307XG5cbiAgZm9yIChjb25zdCBzaGlwTmFtZSBpbiBTaGlwTmFtZXMpIHtcbiAgICBsZXQgc2hpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHNoaXAuY2xhc3NMaXN0LmFkZChzaGlwTmFtZSk7XG4gICAgc2hpcC5pZCA9IG5hbWUgKyBzaGlwTmFtZTtcbiAgICBzaGlwLmNsYXNzTGlzdC5hZGQoJ3NoaXAnKTtcbiAgICBzaGlwLmNsYXNzTGlzdC5hZGQoJ3ZlcnRpY2FsU2hpcCcpO1xuICAgIHNoaXAuc3R5bGUuZ3JpZEFyZWEgPSBzaGlwTmFtZTtcbiAgICBzaGlwLmRyYWdnYWJsZSA9IHRydWU7XG4gICAgc2hpcC5vbmRyYWdzdGFydCA9IChlKSA9PiB7XG4gICAgICBpZiAoc2hpcHlhcmQub25TaGlwRHJhZ1N0YXJ0IGluc3RhbmNlb2YgRnVuY3Rpb24pXG4gICAgICAgIHNoaXB5YXJkLm9uU2hpcERyYWdTdGFydChlLCBzaGlwTmFtZSk7XG4gICAgfTtcbiAgICBzaGlwLm9uY2xpY2sgPSAoZSkgPT4ge1xuICAgICAgaWYgKHNoaXB5YXJkLm9uU2hpcENsaWNrIGluc3RhbmNlb2YgRnVuY3Rpb24pXG4gICAgICAgIHNoaXB5YXJkLm9uU2hpcENsaWNrKGUsIHNoaXBOYW1lKTtcbiAgICB9O1xuICAgIHNoaXAudGV4dENvbnRlbnQgPSBzaGlwTmFtZTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoc2hpcCk7XG4gIH1cblxuICBzaGlweWFyZC5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKGNvbnN0IHNoaXBOYW1lIGluIFNoaXBOYW1lcykge1xuICAgICAgbGV0IHNoaXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYW1lICsgc2hpcE5hbWUpO1xuICAgICAgc2hpcC5jbGFzc0xpc3QucmVtb3ZlKCdob3Jpem9udGFsU2hpcCcpO1xuICAgICAgc2hpcC5jbGFzc0xpc3QuYWRkKCd2ZXJ0aWNhbFNoaXAnKTtcbiAgICAgIHNoaXAuc3R5bGUuZ3JpZEFyZWEgPSBzaGlwTmFtZTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChzaGlwKTtcbiAgICB9XG4gIH07XG5cbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRpdik7XG4gIHJldHVybiBzaGlweWFyZDtcbn1cbiIsImltcG9ydCBCb2FyZCBmcm9tICcuL0JvYXJkJztcbmltcG9ydCBTaGlwTmFtZXMgZnJvbSAnLi9TaGlwTmFtZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTaW1wbGVBSSgpIHtcbiAgbGV0IHNpemUgPSAxMDtcbiAgbGV0IHJlbWFpbmluZ0d1ZXNzZXMgPSBbXTtcbiAgbGV0IGhpc3RvcnkgPSBbXTtcbiAgbGV0IHNoaXBzID0ge307XG5cbiAgbGV0IGdldFJhbmRvbVBvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCBtaW4gPSAwO1xuICAgIGxldCBtYXggPSBzaXplO1xuICAgIHJldHVybiB7XG4gICAgICB4OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluLFxuICAgICAgeTogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbixcbiAgICAgIGhvcml6b250YWw6IE1hdGgucmFuZG9tKCkgPCAwLjUsXG4gICAgfTtcbiAgfTtcblxuICBsZXQgc2h1ZmZsZVNoaXBQb3NpdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGJvYXJkID0gQm9hcmQoc2l6ZSk7XG5cbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gU2hpcE5hbWVzKSB7XG4gICAgICBsZXQgcG9zID0gZ2V0UmFuZG9tUG9zaXRpb24oKTtcbiAgICAgIHdoaWxlICghYm9hcmQuaXNWYWxpZFNoaXBQbGFjZW1lbnQobmFtZSwgcG9zLngsIHBvcy55LCBwb3MuaG9yaXpvbnRhbCkpIHtcbiAgICAgICAgcG9zID0gZ2V0UmFuZG9tUG9zaXRpb24oKTtcbiAgICAgIH1cbiAgICAgIGJvYXJkLnBsYWNlU2hpcChuYW1lLCBwb3MueCwgcG9zLnksIHBvcy5ob3Jpem9udGFsKTtcbiAgICAgIHNoaXBzW25hbWVdID0gcG9zO1xuICAgIH1cbiAgfTtcblxuICBsZXQgZ2V0U2hpcFBvc2l0aW9uID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICByZXR1cm4gc2hpcHNbbmFtZV07XG4gIH07XG5cbiAgbGV0IGdldEd1ZXNzID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCBpID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmVtYWluaW5nR3Vlc3Nlcy5sZW5ndGgpO1xuICAgIGxldCBndWVzcyA9IHJlbWFpbmluZ0d1ZXNzZXNbaV07XG4gICAgZ3Vlc3MuaXNIaXQgPSBmYWxzZTtcbiAgICBoaXN0b3J5LnB1c2goZ3Vlc3MpO1xuICAgIHJlbWFpbmluZ0d1ZXNzZXMuc3BsaWNlKGksIDEpO1xuICAgIHJldHVybiBndWVzcztcbiAgfTtcblxuICBsZXQgc2V0RmVlZGJhY2sgPSBmdW5jdGlvbiAoaXNIaXQpIHtcbiAgICBoaXN0b3J5W2hpc3RvcnkubGVuZ3RoIC0gMV0uaXNIaXQgPSBpc0hpdDtcbiAgfTtcblxuICBsZXQgZ2V0SGlzdG9yeSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gWy4uLmhpc3RvcnldO1xuICB9O1xuXG4gIGxldCByZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICBzaHVmZmxlU2hpcFBvc2l0aW9ucygpO1xuICAgIGhpc3RvcnkgPSBbXTtcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHNpemU7IHgrKykge1xuICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBzaXplOyB5KyspIHtcbiAgICAgICAgcmVtYWluaW5nR3Vlc3Nlcy5wdXNoKHsgeCwgeSB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgcmVzZXQoKTtcbiAgcmV0dXJuIHsgZ2V0R3Vlc3MsIGdldEhpc3RvcnksIGdldFNoaXBQb3NpdGlvbiwgcmVzZXQsIHNldEZlZWRiYWNrIH07XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBCYXR0bGVzaGlwIGZyb20gJy4vQmF0dGxlc2hpcCc7XG5pbXBvcnQgRGlzcGxheSBmcm9tICcuL0Rpc3BsYXknO1xuaW1wb3J0IFBsYXllciBmcm9tICcuL1BsYXllcic7XG5pbXBvcnQgU2ltcGxlQUkgZnJvbSAnLi9TaW1wbGVBSSc7XG5cbmxldCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFpbmVyJyk7XG5sZXQgcGxheWVyID0gUGxheWVyKCk7XG5sZXQgb3Bwb25lbnQgPSBTaW1wbGVBSSgpO1xubGV0IGJhdHRsZXNoaXAgPSBCYXR0bGVzaGlwKHBsYXllciwgb3Bwb25lbnQpO1xubGV0IGRpc3BsYXkgPSBEaXNwbGF5KGJhdHRsZXNoaXAsIHBsYXllciwgb3Bwb25lbnQsIGNvbnRhaW5lcik7XG5iYXR0bGVzaGlwLm9uRHJhdyA9ICgpID0+IHtcbiAgZGlzcGxheS5kcmF3KCk7XG59O1xuYmF0dGxlc2hpcC5vbkdhbWVFbmQgPSAoKSA9PiB7XG4gIGRpc3BsYXkuZW5kR2FtZSgpO1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==