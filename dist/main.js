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
      isP1Winner = isP1Turn;
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
        // opponentDisplay.drawShip(name, battleship.getShipInfo(name, false));
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
    info.textContent = `${battleship.isP1Winner ? 'Player' : 'Opponent'}
      wins! All ships sunk! Play again?`;
    reset.classList.remove('invisible');
  };

  let setup = function () {
    setupShipPlacement();
    setupGuessing();
    setupShipyard();
    // this creates a visual of the opponent ships, useful for debugging
    // Shipyard(container, 'opponent');
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
    guess = { x: x, y: y };
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
    return hits.every((v) => {
      if (horizontal) return v.y === y && v.x >= x && v.x < x + length;
      else return v.x === x && v.y >= y && v.y < y + length;
    });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QmF0dGxlc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL0JvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvRGlzcGxheS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL0Rpc3BsYXlCb2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL1BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL1NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9TaGlwTmFtZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9TaGlweWFyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL1NpbXBsZUFJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCb2FyZCBmcm9tICcuL0JvYXJkJztcbmltcG9ydCBTaGlwTmFtZXMgZnJvbSAnLi9TaGlwTmFtZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCYXR0bGVzaGlwKHBsYXllcjEsIHBsYXllcjIpIHtcbiAgbGV0IG9iaiA9IHt9O1xuICBsZXQgc2l6ZSA9IDEwO1xuICBsZXQgcDFCb2FyZCA9IEJvYXJkKHNpemUpO1xuICBsZXQgcDJCb2FyZCA9IEJvYXJkKHNpemUpO1xuICBsZXQgaXNQMVR1cm4gPSB0cnVlO1xuICBsZXQgaXNQMVdpbm5lciA9IGZhbHNlO1xuICBvYmoub25EcmF3ID0ge307XG4gIG9iai5vbkdhbWVFbmQgPSB7fTtcblxuICBsZXQgaXNWYWxpZEd1ZXNzID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICByZXR1cm4geCA+PSAwICYmIHggPCBzaXplICYmIHkgPj0gMCAmJiB5IDwgc2l6ZTtcbiAgfTtcblxuICBvYmoucGxhY2VTaGlwID0gZnVuY3Rpb24gKG5hbWUsIHgsIHksIGhvcml6b250YWwsIGlzUGxheWVyMSkge1xuICAgIGlmIChpc1BsYXllcjEgJiYgcDFCb2FyZC5pc1ZhbGlkU2hpcFBsYWNlbWVudChuYW1lLCB4LCB5LCBob3Jpem9udGFsKSlcbiAgICAgIHAxQm9hcmQucGxhY2VTaGlwKG5hbWUsIHgsIHksIGhvcml6b250YWwpO1xuICAgIGVsc2UgaWYgKHAyQm9hcmQuaXNWYWxpZFNoaXBQbGFjZW1lbnQobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCkpXG4gICAgICBwMkJvYXJkLnBsYWNlU2hpcChuYW1lLCB4LCB5LCBob3Jpem9udGFsKTtcbiAgfTtcblxuICBvYmouZ2V0U2hpcEluZm8gPSBmdW5jdGlvbiAobmFtZSwgaXNQbGF5ZXIxKSB7XG4gICAgcmV0dXJuIGlzUGxheWVyMSA/IHAxQm9hcmQuZ2V0U2hpcEluZm8obmFtZSkgOiBwMkJvYXJkLmdldFNoaXBJbmZvKG5hbWUpO1xuICB9O1xuXG4gIGxldCBuZXh0VHVybiA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgb3Bwb25lbnRCb2FyZCA9IGlzUDFUdXJuID8gcDJCb2FyZCA6IHAxQm9hcmQ7XG4gICAgbGV0IGN1cnJlbnRQbGF5ZXIgPSBpc1AxVHVybiA/IHBsYXllcjEgOiBwbGF5ZXIyO1xuICAgIGxldCBndWVzcyA9IGF3YWl0IGN1cnJlbnRQbGF5ZXIuZ2V0R3Vlc3MoKTtcbiAgICBpZiAoIWlzVmFsaWRHdWVzcyhndWVzcy54LCBndWVzcy55KSlcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFxuICAgICAgICBgUGxheWVyICR7aXNQMVR1cm4gPyAnMScgOiAnMid9IGd1ZXNzIGlzIGludmFsaWQuICgke2d1ZXNzfSlgXG4gICAgICApO1xuXG4gICAgbGV0IGlzSGl0ID0gb3Bwb25lbnRCb2FyZC5oaXQoZ3Vlc3MueCwgZ3Vlc3MueSk7XG4gICAgY3VycmVudFBsYXllci5zZXRGZWVkYmFjayhpc0hpdCk7XG4gICAgaWYgKG9iai5vbkRyYXcgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgb2JqLm9uRHJhdygpO1xuICAgIH1cbiAgICBpc1AxVHVybiA9ICFpc1AxVHVybjtcbiAgICBpZiAoT2JqZWN0LnZhbHVlcyhTaGlwTmFtZXMpLmV2ZXJ5KChuYW1lKSA9PiBvcHBvbmVudEJvYXJkLmlzU3VuayhuYW1lKSkpIHtcbiAgICAgIGlzUDFXaW5uZXIgPSBpc1AxVHVybjtcbiAgICAgIGlmIChvYmoub25HYW1lRW5kIGluc3RhbmNlb2YgRnVuY3Rpb24pIG9iai5vbkdhbWVFbmQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV4dFR1cm4oKTtcbiAgICB9XG4gIH07XG5cbiAgb2JqLmlzUDFUdXJuID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBpc1AxVHVybjtcbiAgfTtcblxuICBvYmouaXNQMVdpbm5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gaXNQMVdpbm5lcjtcbiAgfTtcblxuICBvYmouc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaXNQMVR1cm4gPSB0cnVlO1xuICAgIG5leHRUdXJuKCk7XG4gIH07XG5cbiAgb2JqLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlzUDFUdXJuID0gdHJ1ZTtcbiAgICBpc1AxV2lubmVyID0gZmFsc2U7XG4gICAgcDFCb2FyZC5yZXNldCgpO1xuICAgIHAyQm9hcmQucmVzZXQoKTtcbiAgICBwbGF5ZXIxLnJlc2V0KCk7XG4gICAgcGxheWVyMi5yZXNldCgpO1xuICB9O1xuICByZXR1cm4gb2JqO1xufVxuIiwiaW1wb3J0IFNoaXAgZnJvbSAnLi9TaGlwJztcbmltcG9ydCBTaGlwTmFtZXMgZnJvbSAnLi9TaGlwTmFtZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCb2FyZChzaXplKSB7XG4gIGxldCBzaGlwcyA9IHt9O1xuICBzaGlwc1tTaGlwTmFtZXMuQ2Fycmllcl0gPSBTaGlwKDUpO1xuICBzaGlwc1tTaGlwTmFtZXMuQmF0dGxlc2hpcF0gPSBTaGlwKDQpO1xuICBzaGlwc1tTaGlwTmFtZXMuRGVzdHJveWVyXSA9IFNoaXAoMyk7XG4gIHNoaXBzW1NoaXBOYW1lcy5TdWJtYXJpbmVdID0gU2hpcCgzKTtcbiAgc2hpcHNbU2hpcE5hbWVzLlBhdHJvbEJvYXRdID0gU2hpcCgyKTtcbiAgbGV0IHBsYWNlZFNoaXBzID0gW107XG4gIGxldCB2YWxpZGF0ZVNoaXBJbmZvID0gZnVuY3Rpb24gKG5hbWUsIHgsIHksIGhvcml6b250YWwpIHtcbiAgICBpZiAoc2hpcHNbbmFtZV0gPT09IHVuZGVmaW5lZClcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3I6IG5hbWUgbXVzdCBiZSBhIHZhbGlkIHNoaXAgbmFtZScpO1xuICAgIGlmICh4IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3ggbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gemVybycpO1xuICAgIGlmICh5IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3kgbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gemVybycpO1xuICAgIGlmIChob3Jpem9udGFsICYmIHggKyBzaGlwc1tuYW1lXS5nZXRMZW5ndGgoKSAtIDEgPj0gc2l6ZSlcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFxuICAgICAgICBgeCAke1xuICAgICAgICAgIHggKyBzaGlwc1tuYW1lXS5nZXRMZW5ndGgoKSAtIDFcbiAgICAgICAgfSBtdXN0IGJlIGxlc3MgdGhhbiB0aGUgc2l6ZSBvZiB0aGUgYm9hcmQgKCR7c2l6ZX0pYFxuICAgICAgKTtcbiAgICBpZiAoIWhvcml6b250YWwgJiYgeSArIHNoaXBzW25hbWVdLmdldExlbmd0aCgpIC0gMSA+PSBzaXplKVxuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXG4gICAgICAgIGB5ICgke1xuICAgICAgICAgIHkgKyBzaGlwc1tuYW1lXS5nZXRMZW5ndGgoKSAtIDFcbiAgICAgICAgfSkgbXVzdCBiZSBsZXNzIHRoYW4gdGhlIHNpemUgb2YgdGhlIGJvYXJkICgke3NpemV9KWBcbiAgICAgICk7XG4gIH07XG5cbiAgbGV0IGlzVmFsaWRTaGlwUGxhY2VtZW50ID0gZnVuY3Rpb24gKG5hbWUsIHgsIHksIGhvcml6b250YWwpIHtcbiAgICBpZiAoc2hpcHNbbmFtZV0gPT09IHVuZGVmaW5lZClcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3I6IG5hbWUgbXVzdCBiZSBhIHZhbGlkIHNoaXAgbmFtZScpO1xuICAgIGxldCBsZWZ0ID0geDtcbiAgICBsZXQgdG9wID0geTtcbiAgICBsZXQgcmlnaHQgPSBob3Jpem9udGFsID8gbGVmdCArIHNoaXBzW25hbWVdLmdldExlbmd0aCgpIC0gMSA6IGxlZnQ7XG4gICAgbGV0IGJvdHRvbSA9IGhvcml6b250YWwgPyB0b3AgOiB0b3AgKyBzaGlwc1tuYW1lXS5nZXRMZW5ndGgoKSAtIDE7XG4gICAgaWYgKGxlZnQgPCAwIHx8IHJpZ2h0IDwgMCB8fCByaWdodCA+PSBzaXplIHx8IGJvdHRvbSA+PSBzaXplKSByZXR1cm4gZmFsc2U7XG5cbiAgICByZXR1cm4gIXBsYWNlZFNoaXBzLnNvbWUoKHZhbCkgPT4ge1xuICAgICAgaWYgKHZhbCAhPT0gbmFtZSkge1xuICAgICAgICBsZXQgbCA9IHNoaXBzW3ZhbF0uZ2V0T3JpZ2luKCkueDtcbiAgICAgICAgbGV0IHQgPSBzaGlwc1t2YWxdLmdldE9yaWdpbigpLnk7XG4gICAgICAgIGxldCByID0gc2hpcHNbdmFsXS5pc0hvcml6b250YWwoKSA/IGwgKyBzaGlwc1t2YWxdLmdldExlbmd0aCgpIC0gMSA6IGw7XG4gICAgICAgIGxldCBiID0gc2hpcHNbdmFsXS5pc0hvcml6b250YWwoKSA/IHQgOiB0ICsgc2hpcHNbdmFsXS5nZXRMZW5ndGgoKSAtIDE7XG4gICAgICAgIC8vIHNoaXBzIGNvbGxpZGVcbiAgICAgICAgaWYgKFxuICAgICAgICAgICgobGVmdCA+PSBsICYmIGxlZnQgPD0gcikgfHwgKHJpZ2h0ID49IGwgJiYgcmlnaHQgPD0gcikpICYmXG4gICAgICAgICAgKCh0b3AgPj0gdCAmJiB0b3AgPD0gYikgfHwgKGJvdHRvbSA+PSB0ICYmIGJvdHRvbSA8PSBiKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBsZXQgcGxhY2VTaGlwID0gZnVuY3Rpb24gKG5hbWUsIHgsIHksIGhvcml6b250YWwpIHtcbiAgICB2YWxpZGF0ZVNoaXBJbmZvKG5hbWUsIHgsIHksIGhvcml6b250YWwpO1xuICAgIGlmICghaXNWYWxpZFNoaXBQbGFjZW1lbnQobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCkpIHJldHVybiBmYWxzZTtcbiAgICBzaGlwc1tuYW1lXS5zZXRPcmlnaW4oeCwgeSk7XG4gICAgc2hpcHNbbmFtZV0uc2V0SG9yaXpvbnRhbChob3Jpem9udGFsKTtcbiAgICBpZiAoIXBsYWNlZFNoaXBzLmluY2x1ZGVzKG5hbWUpKSBwbGFjZWRTaGlwcy5wdXNoKG5hbWUpO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIGxldCByZW1vdmVTaGlwID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBpZiAoc2hpcHNbbmFtZV0gPT09IHVuZGVmaW5lZClcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3I6IG5hbWUgbXVzdCBiZSBhIHZhbGlkIHNoaXAgbmFtZScpO1xuICAgIHBsYWNlZFNoaXBzID0gcGxhY2VkU2hpcHMuZmlsdGVyKCh2KSA9PiB2ICE9PSBuYW1lKTtcbiAgICBzaGlwc1tuYW1lXS5yZXNldEhpdHMoKTtcbiAgfTtcblxuICBsZXQgaGl0ID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gc2hpcHMpIHtcbiAgICAgIGlmIChwbGFjZWRTaGlwcy5pbmNsdWRlcyhuYW1lKSAmJiBzaGlwc1tuYW1lXS5oaXQoeCwgeSkpIHJldHVybiBuYW1lO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgbGV0IGlzU3VuayA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgaWYgKHNoaXBzW25hbWVdID09PSB1bmRlZmluZWQpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yOiBuYW1lIG11c3QgYmUgYSB2YWxpZCBzaGlwIG5hbWUnKTtcbiAgICByZXR1cm4gc2hpcHNbbmFtZV0uaXNTdW5rKCk7XG4gIH07XG5cbiAgbGV0IGdldFNoaXBJbmZvID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBpZiAoc2hpcHNbbmFtZV0gPT09IHVuZGVmaW5lZClcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3I6IG5hbWUgbXVzdCBiZSBhIHZhbGlkIHNoaXAgbmFtZScpO1xuICAgIGlmICghcGxhY2VkU2hpcHMuaW5jbHVkZXMobmFtZSkpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9yaWdpbjogc2hpcHNbbmFtZV0uZ2V0T3JpZ2luKCksXG4gICAgICBob3Jpem9udGFsOiBzaGlwc1tuYW1lXS5pc0hvcml6b250YWwoKSxcbiAgICAgIHN1bms6IHNoaXBzW25hbWVdLmlzU3VuaygpLFxuICAgICAgbGVuZ3RoOiBzaGlwc1tuYW1lXS5nZXRMZW5ndGgoKSxcbiAgICB9O1xuICB9O1xuXG4gIGxldCByZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gU2hpcE5hbWVzKSB7XG4gICAgICByZW1vdmVTaGlwKG5hbWUpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHBsYWNlU2hpcCxcbiAgICByZW1vdmVTaGlwLFxuICAgIGhpdCxcbiAgICBpc1N1bmssXG4gICAgZ2V0U2hpcEluZm8sXG4gICAgaXNWYWxpZFNoaXBQbGFjZW1lbnQsXG4gICAgcmVzZXQsXG4gIH07XG59XG4iLCJpbXBvcnQgRGlzcGxheUJvYXJkIGZyb20gJy4vRGlzcGxheUJvYXJkJztcbmltcG9ydCBTaGlwTmFtZXMgZnJvbSAnLi9TaGlwTmFtZXMnO1xuaW1wb3J0IFNoaXB5YXJkIGZyb20gJy4vU2hpcHlhcmQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBEaXNwbGF5KGJhdHRsZXNoaXAsIHBsYXllciwgb3Bwb25lbnQsIGNvbnRhaW5lcikge1xuICBsZXQgb3Bwb25lbnREaXNwbGF5ID0gRGlzcGxheUJvYXJkKGNvbnRhaW5lciwgJ29wcG9uZW50Jyk7XG4gIG9wcG9uZW50RGlzcGxheS5hbGxvd1NoaXBQbGFjZW1lbnQoZmFsc2UpO1xuICBsZXQgcGxheWVyRGlzcGxheSA9IERpc3BsYXlCb2FyZChjb250YWluZXIsICdwbGF5ZXInKTtcbiAgbGV0IHNoaXB5YXJkID0gU2hpcHlhcmQoY29udGFpbmVyLCAncGxheWVyJyk7XG4gIHBsYXllckRpc3BsYXkuYWxsb3dTaGlwUGxhY2VtZW50KHRydWUpO1xuICBsZXQgc3RhcnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgbGV0IGluZm8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgbGV0IHJlc2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cbiAgbGV0IGlzQWxsU2hpcHNQbGFjZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKFNoaXBOYW1lcykuZXZlcnkoXG4gICAgICAobmFtZSkgPT4gYmF0dGxlc2hpcC5nZXRTaGlwSW5mbyhuYW1lLCB0cnVlKSAhPT0gdW5kZWZpbmVkXG4gICAgKTtcbiAgfTtcblxuICBsZXQgc2V0dXBTaGlwUGxhY2VtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHBsYXllckRpc3BsYXkub25DZWxsRHJvcCA9IChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBsZXQgaW5mbyA9IEpTT04ucGFyc2UoZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgndGV4dCcpKTtcbiAgICAgIGxldCBvcmlnaW4gPSBwbGF5ZXJEaXNwbGF5LmNlbGxGcm9tUG9pbnQoXG4gICAgICAgIGUueCAtIGUub2Zmc2V0WCAtIGluZm8ub2Zmc2V0WCArIDI1LFxuICAgICAgICBlLnkgLSBlLm9mZnNldFkgLSBpbmZvLm9mZnNldFkgKyAyNVxuICAgICAgKTtcbiAgICAgIGlmIChvcmlnaW4gIT09IHVuZGVmaW5lZClcbiAgICAgICAgYmF0dGxlc2hpcC5wbGFjZVNoaXAoXG4gICAgICAgICAgaW5mby5uYW1lLFxuICAgICAgICAgIG9yaWdpbi54LFxuICAgICAgICAgIG9yaWdpbi55LFxuICAgICAgICAgIGluZm8uaG9yaXpvbnRhbCxcbiAgICAgICAgICB0cnVlXG4gICAgICAgICk7XG4gICAgICBwbGF5ZXJEaXNwbGF5LmRyYXdTaGlwKFxuICAgICAgICBpbmZvLm5hbWUsXG4gICAgICAgIGJhdHRsZXNoaXAuZ2V0U2hpcEluZm8oaW5mby5uYW1lLCB0cnVlKVxuICAgICAgKTtcbiAgICAgIGlmIChpc0FsbFNoaXBzUGxhY2VkKCkpIHN0YXJ0LmRpc2FibGVkID0gZmFsc2U7XG4gICAgfTtcbiAgfTtcbiAgbGV0IHNldHVwR3Vlc3NpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgb3Bwb25lbnREaXNwbGF5Lm9uQ2VsbENsaWNrID0gKGUpID0+IHtcbiAgICAgIGxldCBvcmlnaW4gPSBvcHBvbmVudERpc3BsYXkuY2VsbEZyb21Qb2ludChcbiAgICAgICAgZS54IC0gZS5vZmZzZXRYLFxuICAgICAgICBlLnkgLSBlLm9mZnNldFlcbiAgICAgICk7XG4gICAgICBwbGF5ZXIuc2V0R3Vlc3Mob3JpZ2luLngsIG9yaWdpbi55KTtcbiAgICB9O1xuICB9O1xuXG4gIGxldCBzZXR1cFNoaXB5YXJkID0gZnVuY3Rpb24gKCkge1xuICAgIHNoaXB5YXJkLm9uU2hpcERyYWdTdGFydCA9IChlLCBuYW1lKSA9PiB7XG4gICAgICBsZXQgaW5mbyA9IGJhdHRsZXNoaXAuZ2V0U2hpcEluZm8obmFtZSwgdHJ1ZSk7XG4gICAgICBsZXQgaG9yaXpvbnRhbCA9IGluZm8gPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogaW5mby5ob3Jpem9udGFsO1xuICAgICAgZS5kYXRhVHJhbnNmZXIuc2V0RGF0YShcbiAgICAgICAgJ3RleHQnLFxuICAgICAgICBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICBvZmZzZXRYOiBlLm9mZnNldFgsXG4gICAgICAgICAgb2Zmc2V0WTogZS5vZmZzZXRZLFxuICAgICAgICAgIGhvcml6b250YWw6IGhvcml6b250YWwsXG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH07XG4gICAgc2hpcHlhcmQub25TaGlwQ2xpY2sgPSAoZSwgbmFtZSkgPT4ge1xuICAgICAgbGV0IGluZm8gPSBiYXR0bGVzaGlwLmdldFNoaXBJbmZvKG5hbWUsIHRydWUpO1xuICAgICAgaWYgKGluZm8gPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgICAgYmF0dGxlc2hpcC5wbGFjZVNoaXAoXG4gICAgICAgIG5hbWUsXG4gICAgICAgIGluZm8ub3JpZ2luLngsXG4gICAgICAgIGluZm8ub3JpZ2luLnksXG4gICAgICAgICFpbmZvLmhvcml6b250YWwsXG4gICAgICAgIHRydWVcbiAgICAgICk7XG4gICAgICBwbGF5ZXJEaXNwbGF5LmRyYXdTaGlwKG5hbWUsIGJhdHRsZXNoaXAuZ2V0U2hpcEluZm8obmFtZSwgdHJ1ZSkpO1xuICAgIH07XG4gIH07XG5cbiAgbGV0IHNldHVwU3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHN0YXJ0RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgc3RhcnREaXYuY2xhc3NMaXN0LmFkZCgnc3RhcnREaXYnKTtcbiAgICBzdGFydC5jbGFzc0xpc3QuYWRkKCdzdGFydCcpO1xuICAgIHN0YXJ0LmRpc2FibGVkID0gdHJ1ZTtcbiAgICBzdGFydC50ZXh0Q29udGVudCA9ICdTdGFydCBHYW1lJztcbiAgICBzdGFydC5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBuYW1lIGluIFNoaXBOYW1lcykge1xuICAgICAgICBsZXQgcG9zID0gb3Bwb25lbnQuZ2V0U2hpcFBvc2l0aW9uKG5hbWUpO1xuICAgICAgICBiYXR0bGVzaGlwLnBsYWNlU2hpcChuYW1lLCBwb3MueCwgcG9zLnksIHBvcy5ob3Jpem9udGFsLCBmYWxzZSk7XG4gICAgICAgIC8vIG9wcG9uZW50RGlzcGxheS5kcmF3U2hpcChuYW1lLCBiYXR0bGVzaGlwLmdldFNoaXBJbmZvKG5hbWUsIGZhbHNlKSk7XG4gICAgICB9XG4gICAgICBwbGF5ZXJEaXNwbGF5LmFsbG93U2hpcFBsYWNlbWVudChmYWxzZSk7XG4gICAgICBiYXR0bGVzaGlwLnN0YXJ0KCk7XG4gICAgICBzdGFydC5jbGFzc0xpc3QuYWRkKCdpbnZpc2libGUnKTtcbiAgICAgIGluZm8udGV4dENvbnRlbnQgPSAnTWFrZSB5b3VyIGd1ZXNzISc7XG4gICAgfTtcbiAgICBzdGFydERpdi5hcHBlbmRDaGlsZChzdGFydCk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHN0YXJ0RGl2KTtcbiAgfTtcblxuICBsZXQgc2V0dXBJbmZvID0gZnVuY3Rpb24gKCkge1xuICAgIGluZm8uY2xhc3NMaXN0LmFkZCgnaW5mbycpO1xuICAgIGluZm8udGV4dENvbnRlbnQgPSAnUGxhY2UgeW91ciBzaGlwcyEnO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChpbmZvKTtcbiAgfTtcblxuICBsZXQgc2V0dXBSZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXNldC5jbGFzc0xpc3QuYWRkKCdyZXNldCcpO1xuICAgIHJlc2V0LmNsYXNzTGlzdC5hZGQoJ2ludmlzaWJsZScpO1xuICAgIHJlc2V0LnRleHRDb250ZW50ID0gJ1BsYXkgQWdhaW4nO1xuICAgIHJlc2V0Lm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICBzaGlweWFyZC5yZXNldCgpO1xuICAgICAgb3Bwb25lbnREaXNwbGF5LnJlc2V0KCk7XG4gICAgICBwbGF5ZXJEaXNwbGF5LnJlc2V0KCk7XG4gICAgICBiYXR0bGVzaGlwLnJlc2V0KCk7XG4gICAgICByZXNldC5jbGFzc0xpc3QuYWRkKCdpbnZpc2libGUnKTtcbiAgICAgIHN0YXJ0LmNsYXNzTGlzdC5yZW1vdmUoJ2ludmlzaWJsZScpO1xuICAgICAgc3RhcnQuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgaW5mby50ZXh0Q29udGVudCA9ICdQbGFjZSB5b3VyIHNoaXBzISc7XG4gICAgfTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocmVzZXQpO1xuICB9O1xuXG4gIGxldCBkcmF3U2hpcHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgZm9yIChjb25zdCBuYW1lIGluIFNoaXBOYW1lcykge1xuICAgICAgcGxheWVyRGlzcGxheS5kcmF3U2hpcChuYW1lLCBiYXR0bGVzaGlwLmdldFNoaXBJbmZvKG5hbWUsIHRydWUpKTtcbiAgICB9XG4gIH07XG5cbiAgbGV0IGRyYXdHdWVzc2VzID0gZnVuY3Rpb24gKCkge1xuICAgIHBsYXllci5nZXRIaXN0b3J5KCkuZm9yRWFjaCgoZSkgPT4ge1xuICAgICAgb3Bwb25lbnREaXNwbGF5LmRyYXdHdWVzcyhlLngsIGUueSwgZS5pc0hpdCk7XG4gICAgfSk7XG5cbiAgICBvcHBvbmVudC5nZXRIaXN0b3J5KCkuZm9yRWFjaCgoZSkgPT4ge1xuICAgICAgcGxheWVyRGlzcGxheS5kcmF3R3Vlc3MoZS54LCBlLnksIGUuaXNIaXQpO1xuICAgIH0pO1xuICB9O1xuXG4gIGxldCBkcmF3ID0gZnVuY3Rpb24gKCkge1xuICAgIGRyYXdTaGlwcygpO1xuICAgIGRyYXdHdWVzc2VzKCk7XG4gICAgaWYgKCFiYXR0bGVzaGlwLmlzUDFUdXJuKCkpIHtcbiAgICAgIGxldCBwbGF5ZXJIaXN0b3J5ID0gcGxheWVyLmdldEhpc3RvcnkoKTtcbiAgICAgIGxldCBwbGF5ZXJHdWVzcyA9IHBsYXllckhpc3RvcnlbcGxheWVySGlzdG9yeS5sZW5ndGggLSAxXTtcbiAgICAgIGxldCBvcHBvbmVudEhpc3RvcnkgPSBvcHBvbmVudC5nZXRIaXN0b3J5KCk7XG4gICAgICBsZXQgb3Bwb25lbnRHdWVzcyA9IG9wcG9uZW50SGlzdG9yeVtvcHBvbmVudEhpc3RvcnkubGVuZ3RoIC0gMV07XG4gICAgICBpbmZvLnRleHRDb250ZW50ID0gYCR7cGxheWVyR3Vlc3MuaXNIaXQgPyAnSGl0JyA6ICdNaXNzJ30hXG4gICAgICAgIE9wcG9uZW50ICR7b3Bwb25lbnRHdWVzcy5pc0hpdCA/ICdoaXQnIDogJ21pc3NlZCd9IVxuICAgICAgICBHdWVzcyBhZ2FpbiFgO1xuICAgIH1cbiAgfTtcblxuICBsZXQgZW5kR2FtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpbmZvLnRleHRDb250ZW50ID0gYCR7YmF0dGxlc2hpcC5pc1AxV2lubmVyID8gJ1BsYXllcicgOiAnT3Bwb25lbnQnfVxuICAgICAgd2lucyEgQWxsIHNoaXBzIHN1bmshIFBsYXkgYWdhaW4/YDtcbiAgICByZXNldC5jbGFzc0xpc3QucmVtb3ZlKCdpbnZpc2libGUnKTtcbiAgfTtcblxuICBsZXQgc2V0dXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgc2V0dXBTaGlwUGxhY2VtZW50KCk7XG4gICAgc2V0dXBHdWVzc2luZygpO1xuICAgIHNldHVwU2hpcHlhcmQoKTtcbiAgICAvLyB0aGlzIGNyZWF0ZXMgYSB2aXN1YWwgb2YgdGhlIG9wcG9uZW50IHNoaXBzLCB1c2VmdWwgZm9yIGRlYnVnZ2luZ1xuICAgIC8vIFNoaXB5YXJkKGNvbnRhaW5lciwgJ29wcG9uZW50Jyk7XG4gICAgc2V0dXBTdGFydCgpO1xuICAgIHNldHVwSW5mbygpO1xuICAgIHNldHVwUmVzZXQoKTtcbiAgfTtcblxuICBzZXR1cCgpO1xuICByZXR1cm4geyBkcmF3LCBlbmRHYW1lIH07XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBEaXNwbGF5Qm9hcmQoY29udGFpbmVyLCBuYW1lKSB7XG4gIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGl2LmNsYXNzTGlzdC5hZGQoJ2JvYXJkJyk7XG4gIGxldCBpbWFnZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBpbWFnZURpdi5jbGFzc0xpc3QuYWRkKCdncmlkJyk7XG4gIGRpdi5hcHBlbmRDaGlsZChpbWFnZURpdik7XG5cbiAgbGV0IGRpc3BsYXlCb2FyZCA9IHt9O1xuICBkaXNwbGF5Qm9hcmQub25DZWxsRHJvcCA9IHt9O1xuICBkaXNwbGF5Qm9hcmQub25DZWxsQ2xpY2sgPSB7fTtcbiAgZGlzcGxheUJvYXJkLmNlbGxGcm9tUG9pbnQgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgIGxldCBjZWxsID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludCh4LCB5KTtcbiAgICBpZiAoY2VsbC5jbGFzc0xpc3QuY29udGFpbnMoJ2NlbGwnKSAmJiBkaXYuY29udGFpbnMoY2VsbCkpXG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShjZWxsLmlkKTtcbiAgICBlbHNlIHJldHVybiB1bmRlZmluZWQ7XG4gIH07XG5cbiAgZGlzcGxheUJvYXJkLmFsbG93U2hpcFBsYWNlbWVudCA9IGZ1bmN0aW9uIChhbGxvdykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGl2LmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgY2VsbCA9IGRpdi5jaGlsZHJlbltpXTtcbiAgICAgIGlmIChjZWxsLmNsYXNzTGlzdC5jb250YWlucygnY2VsbCcpICYmIGRpdi5jb250YWlucyhjZWxsKSkge1xuICAgICAgICBpZiAoYWxsb3cpIGNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnY2VsbEZvcndhcmQnKTtcbiAgICAgICAgZWxzZSBjZWxsLmNsYXNzTGlzdC5hZGQoJ2NlbGxGb3J3YXJkJyk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGRpc3BsYXlCb2FyZC5kcmF3U2hpcCA9IGZ1bmN0aW9uIChzaGlwTmFtZSwgaW5mbykge1xuICAgIGlmIChpbmZvICE9IHVuZGVmaW5lZCkge1xuICAgICAgbGV0IHNoaXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYW1lICsgc2hpcE5hbWUpO1xuICAgICAgbGV0IHJpZ2h0ID0gaW5mby5vcmlnaW4ueCArIDM7XG4gICAgICBsZXQgYm90dG9tID0gaW5mby5vcmlnaW4ueSArIDM7XG4gICAgICBpZiAoaW5mby5ob3Jpem9udGFsKSB7XG4gICAgICAgIHJpZ2h0ICs9IGluZm8ubGVuZ3RoIC0gMTtcbiAgICAgICAgc2hpcC5jbGFzc0xpc3QucmVtb3ZlKCd2ZXJ0aWNhbFNoaXAnKTtcbiAgICAgICAgc2hpcC5jbGFzc0xpc3QuYWRkKCdob3Jpem9udGFsU2hpcCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYm90dG9tICs9IGluZm8ubGVuZ3RoIC0gMTtcbiAgICAgICAgc2hpcC5jbGFzc0xpc3QucmVtb3ZlKCdob3Jpem9udGFsU2hpcCcpO1xuICAgICAgICBzaGlwLmNsYXNzTGlzdC5hZGQoJ3ZlcnRpY2FsU2hpcCcpO1xuICAgICAgfVxuICAgICAgc2hpcC5zdHlsZS5ncmlkQXJlYSA9IGBcbiAgICAgICAgICAgICR7aW5mby5vcmlnaW4ueSArIDJ9IC9cbiAgICAgICAgICAgICR7aW5mby5vcmlnaW4ueCArIDJ9IC9cbiAgICAgICAgICAgICR7Ym90dG9tfSAvXG4gICAgICAgICAgICAke3JpZ2h0fWA7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoc2hpcCk7XG4gICAgfVxuICB9O1xuXG4gIGRpc3BsYXlCb2FyZC5kcmF3R3Vlc3MgPSBmdW5jdGlvbiAoeCwgeSwgaXNIaXQpIHtcbiAgICBsZXQgY2VsbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEpTT04uc3RyaW5naWZ5KHsgbmFtZSwgeCwgeSB9KSk7XG4gICAgY2VsbC50ZXh0Q29udGVudCA9IGlzSGl0ID8gJ1gnIDogJzAnO1xuICB9O1xuXG4gIGRpc3BsYXlCb2FyZC5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRpdi5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGNlbGwgPSBkaXYuY2hpbGRyZW5baV07XG4gICAgICBpZiAoY2VsbC5jbGFzc0xpc3QuY29udGFpbnMoJ2NlbGwnKSAmJiBkaXYuY29udGFpbnMoY2VsbCkpIHtcbiAgICAgICAgY2VsbC50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ2NlbGxGb3J3YXJkJyk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGxldCBzZXR1cENlbGxzID0gZnVuY3Rpb24gKCkge1xuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgMTE7IHkrKykge1xuICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCAxMTsgeCsrKSB7XG4gICAgICAgIGxldCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGNlbGwuaWQgPSBKU09OLnN0cmluZ2lmeSh7IG5hbWUsIHg6IHggLSAxLCB5OiB5IC0gMSB9KTtcbiAgICAgICAgY2VsbC5zdHlsZS5ncmlkQXJlYSA9IGAke3kgKyAxfSAvICR7eCArIDF9IC8gJHt5ICsgMn0gLyAke3ggKyAyfWA7XG4gICAgICAgIGlmICh5ID09PSAwICYmIHggPiAwKSB7XG4gICAgICAgICAgY2VsbC50ZXh0Q29udGVudCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoNjQgKyB4KTtcbiAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ2xhYmVsQ2VsbCcpO1xuICAgICAgICB9IGVsc2UgaWYgKHggPT09IDAgJiYgeSA+IDApIHtcbiAgICAgICAgICBjZWxsLnRleHRDb250ZW50ID0geS50b1N0cmluZygpO1xuICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnbGFiZWxDZWxsJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoeCA+IDAgJiYgeSA+IDApIHtcbiAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ2NlbGwnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNlbGwub25kcmFnb3ZlciA9IChlKSA9PiBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNlbGwub25kcm9wID0gKGUpID0+IHtcbiAgICAgICAgICBpZiAoZGlzcGxheUJvYXJkLm9uQ2VsbERyb3AgaW5zdGFuY2VvZiBGdW5jdGlvbilcbiAgICAgICAgICAgIGRpc3BsYXlCb2FyZC5vbkNlbGxEcm9wKGUsIHggKyAxLCB5ICsgMSk7XG4gICAgICAgIH07XG4gICAgICAgIGNlbGwub25jbGljayA9IChlKSA9PiB7XG4gICAgICAgICAgaWYgKGRpc3BsYXlCb2FyZC5vbkNlbGxDbGljayBpbnN0YW5jZW9mIEZ1bmN0aW9uKVxuICAgICAgICAgICAgZGlzcGxheUJvYXJkLm9uQ2VsbENsaWNrKGUsIHggKyAxLCB5ICsgMSk7XG4gICAgICAgIH07XG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChjZWxsKTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRpdik7XG4gIH07XG5cbiAgc2V0dXBDZWxscygpO1xuICByZXR1cm4gZGlzcGxheUJvYXJkO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUGxheWVyKCkge1xuICBsZXQgZ3Vlc3MgPSB1bmRlZmluZWQ7XG4gIGxldCBoaXN0b3J5ID0gW107XG5cbiAgbGV0IGdldEd1ZXNzID0gYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgIHdoaWxlIChndWVzcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHJlc29sdmUoKSwgNTApO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGxldCByZXQgPSB7IHg6IGd1ZXNzLngsIHk6IGd1ZXNzLnksIGlzSGl0OiBmYWxzZSB9O1xuICAgIGhpc3RvcnkucHVzaChyZXQpO1xuICAgIGd1ZXNzID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiByZXQ7XG4gIH07XG5cbiAgbGV0IHNldEd1ZXNzID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICBndWVzcyA9IHsgeDogeCwgeTogeSB9O1xuICB9O1xuXG4gIGxldCBzZXRGZWVkYmFjayA9IGZ1bmN0aW9uIChpc0hpdCkge1xuICAgIGhpc3RvcnlbaGlzdG9yeS5sZW5ndGggLSAxXS5pc0hpdCA9IGlzSGl0O1xuICB9O1xuXG4gIGxldCBnZXRIaXN0b3J5ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBbLi4uaGlzdG9yeV07XG4gIH07XG5cbiAgbGV0IHJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIGd1ZXNzID0gdW5kZWZpbmVkO1xuICAgIGhpc3RvcnkgPSBbXTtcbiAgfTtcblxuICByZXR1cm4geyBnZXRHdWVzcywgc2V0R3Vlc3MsIGdldEhpc3RvcnksIHNldEZlZWRiYWNrLCByZXNldCB9O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2hpcChsZW5ndGgpIHtcbiAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKGxlbmd0aCkpXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignbGVuZ3RoIG11c3QgYmUgYW4gaW50ZWdlcicpO1xuICBlbHNlIGlmIChsZW5ndGggPCAwKVxuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdTaGlwIGxlbmd0aCBjYW5ub3QgYmUgbGVzcyB0aGFuIHplcm8nKTtcbiAgbGV0IHggPSAwO1xuICBsZXQgeSA9IDA7XG4gIGxldCBob3Jpem9udGFsID0gZmFsc2U7XG4gIGxldCBoaXRzID0gW107XG5cbiAgbGV0IGdldExlbmd0aCA9ICgpID0+IHtcbiAgICByZXR1cm4gbGVuZ3RoO1xuICB9O1xuXG4gIGxldCBzZXRPcmlnaW4gPSAobmV3WCwgbmV3WSkgPT4ge1xuICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcihuZXdYKSkgdGhyb3cgbmV3IFR5cGVFcnJvcigneCBtdXN0IGJlIGFuIGludGVnZXInKTtcbiAgICBlbHNlIGlmICghTnVtYmVyLmlzSW50ZWdlcihuZXdZKSlcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3kgbXVzdCBiZSBhbiBpbnRlZ2VyJyk7XG5cbiAgICB4ID0gbmV3WDtcbiAgICB5ID0gbmV3WTtcbiAgfTtcblxuICBsZXQgZ2V0T3JpZ2luID0gKCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICB4LFxuICAgICAgeSxcbiAgICB9O1xuICB9O1xuXG4gIGxldCBpc0hvcml6b250YWwgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGhvcml6b250YWw7XG4gIH07XG5cbiAgbGV0IHNldEhvcml6b250YWwgPSAodmFsdWUpID0+IHtcbiAgICBob3Jpem9udGFsID0gISF2YWx1ZTtcbiAgfTtcblxuICBsZXQgaGl0ID0gKHRhcmdldFgsIHRhcmdldFkpID0+IHtcbiAgICBpZiAoIU51bWJlci5pc0ludGVnZXIodGFyZ2V0WCkpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0YXJnZXRYIG11c3QgYmUgYW4gaW50ZWdlcicpO1xuICAgIGVsc2UgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKHRhcmdldFkpKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndGFyZ2V0WSBtdXN0IGJlIGFuIGludGVnZXInKTtcblxuICAgIGxldCBzdWNjZXNzID1cbiAgICAgIChob3Jpem9udGFsICYmIHkgPT09IHRhcmdldFkgJiYgdGFyZ2V0WCA+PSB4ICYmIHRhcmdldFggPCB4ICsgbGVuZ3RoKSB8fFxuICAgICAgKCFob3Jpem9udGFsICYmIHggPT09IHRhcmdldFggJiYgdGFyZ2V0WSA+PSB5ICYmIHRhcmdldFkgPCB5ICsgbGVuZ3RoKTtcbiAgICBpZiAoc3VjY2VzcykgaGl0cy5wdXNoKHsgeDogdGFyZ2V0WCwgeTogdGFyZ2V0WSB9KTtcbiAgICByZXR1cm4gc3VjY2VzcztcbiAgfTtcblxuICBsZXQgaXNTdW5rID0gKCkgPT4ge1xuICAgIGlmIChoaXRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiBoaXRzLmV2ZXJ5KCh2KSA9PiB7XG4gICAgICBpZiAoaG9yaXpvbnRhbCkgcmV0dXJuIHYueSA9PT0geSAmJiB2LnggPj0geCAmJiB2LnggPCB4ICsgbGVuZ3RoO1xuICAgICAgZWxzZSByZXR1cm4gdi54ID09PSB4ICYmIHYueSA+PSB5ICYmIHYueSA8IHkgKyBsZW5ndGg7XG4gICAgfSk7XG4gIH07XG5cbiAgbGV0IHJlc2V0SGl0cyA9ICgpID0+IChoaXRzLmxlbmd0aCA9IDApO1xuICByZXR1cm4ge1xuICAgIGdldExlbmd0aCxcbiAgICBnZXRPcmlnaW4sXG4gICAgc2V0T3JpZ2luLFxuICAgIGlzSG9yaXpvbnRhbCxcbiAgICBzZXRIb3Jpem9udGFsLFxuICAgIGhpdCxcbiAgICBpc1N1bmssXG4gICAgcmVzZXRIaXRzLFxuICB9O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIFNoaXBOYW1lcygpIHtcbiAgcmV0dXJuIHtcbiAgICBDYXJyaWVyOiAnQ2FycmllcicsXG4gICAgQmF0dGxlc2hpcDogJ0JhdHRsZXNoaXAnLFxuICAgIERlc3Ryb3llcjogJ0Rlc3Ryb3llcicsXG4gICAgU3VibWFyaW5lOiAnU3VibWFyaW5lJyxcbiAgICBQYXRyb2xCb2F0OiAnUGF0cm9sQm9hdCcsXG4gIH07XG59KSgpO1xuIiwiaW1wb3J0IFNoaXBOYW1lcyBmcm9tICcuL1NoaXBOYW1lcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNoaXB5YXJkKGNvbnRhaW5lciwgbmFtZSkge1xuICBsZXQgc2hpcHlhcmQgPSB7fTtcbiAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBkaXYuY2xhc3NMaXN0LmFkZChuYW1lICsgJ3NoaXB5YXJkJyk7XG4gIHNoaXB5YXJkLm9uU2hpcENsaWNrID0ge307XG4gIHNoaXB5YXJkLm9uU2hpcERyYWdTdGFydCA9IHt9O1xuXG4gIGZvciAoY29uc3Qgc2hpcE5hbWUgaW4gU2hpcE5hbWVzKSB7XG4gICAgbGV0IHNoaXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBzaGlwLmNsYXNzTGlzdC5hZGQoc2hpcE5hbWUpO1xuICAgIHNoaXAuaWQgPSBuYW1lICsgc2hpcE5hbWU7XG4gICAgc2hpcC5jbGFzc0xpc3QuYWRkKCdzaGlwJyk7XG4gICAgc2hpcC5jbGFzc0xpc3QuYWRkKCd2ZXJ0aWNhbFNoaXAnKTtcbiAgICBzaGlwLnN0eWxlLmdyaWRBcmVhID0gc2hpcE5hbWU7XG4gICAgc2hpcC5kcmFnZ2FibGUgPSB0cnVlO1xuICAgIHNoaXAub25kcmFnc3RhcnQgPSAoZSkgPT4ge1xuICAgICAgaWYgKHNoaXB5YXJkLm9uU2hpcERyYWdTdGFydCBpbnN0YW5jZW9mIEZ1bmN0aW9uKVxuICAgICAgICBzaGlweWFyZC5vblNoaXBEcmFnU3RhcnQoZSwgc2hpcE5hbWUpO1xuICAgIH07XG4gICAgc2hpcC5vbmNsaWNrID0gKGUpID0+IHtcbiAgICAgIGlmIChzaGlweWFyZC5vblNoaXBDbGljayBpbnN0YW5jZW9mIEZ1bmN0aW9uKVxuICAgICAgICBzaGlweWFyZC5vblNoaXBDbGljayhlLCBzaGlwTmFtZSk7XG4gICAgfTtcbiAgICBzaGlwLnRleHRDb250ZW50ID0gc2hpcE5hbWU7XG4gICAgZGl2LmFwcGVuZENoaWxkKHNoaXApO1xuICB9XG5cbiAgc2hpcHlhcmQucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgZm9yIChjb25zdCBzaGlwTmFtZSBpbiBTaGlwTmFtZXMpIHtcbiAgICAgIGxldCBzaGlwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmFtZSArIHNoaXBOYW1lKTtcbiAgICAgIHNoaXAuY2xhc3NMaXN0LnJlbW92ZSgnaG9yaXpvbnRhbFNoaXAnKTtcbiAgICAgIHNoaXAuY2xhc3NMaXN0LmFkZCgndmVydGljYWxTaGlwJyk7XG4gICAgICBzaGlwLnN0eWxlLmdyaWRBcmVhID0gc2hpcE5hbWU7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoc2hpcCk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkaXYpO1xuICByZXR1cm4gc2hpcHlhcmQ7XG59XG4iLCJpbXBvcnQgQm9hcmQgZnJvbSAnLi9Cb2FyZCc7XG5pbXBvcnQgU2hpcE5hbWVzIGZyb20gJy4vU2hpcE5hbWVzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2ltcGxlQUkoKSB7XG4gIGxldCBzaXplID0gMTA7XG4gIGxldCByZW1haW5pbmdHdWVzc2VzID0gW107XG4gIGxldCBoaXN0b3J5ID0gW107XG4gIGxldCBzaGlwcyA9IHt9O1xuXG4gIGxldCBnZXRSYW5kb21Qb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgbWluID0gMDtcbiAgICBsZXQgbWF4ID0gc2l6ZTtcbiAgICByZXR1cm4ge1xuICAgICAgeDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbixcbiAgICAgIHk6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW4sXG4gICAgICBob3Jpem9udGFsOiBNYXRoLnJhbmRvbSgpIDwgMC41LFxuICAgIH07XG4gIH07XG5cbiAgbGV0IHNodWZmbGVTaGlwUG9zaXRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCBib2FyZCA9IEJvYXJkKHNpemUpO1xuXG4gICAgZm9yIChjb25zdCBuYW1lIGluIFNoaXBOYW1lcykge1xuICAgICAgbGV0IHBvcyA9IGdldFJhbmRvbVBvc2l0aW9uKCk7XG4gICAgICB3aGlsZSAoIWJvYXJkLmlzVmFsaWRTaGlwUGxhY2VtZW50KG5hbWUsIHBvcy54LCBwb3MueSwgcG9zLmhvcml6b250YWwpKSB7XG4gICAgICAgIHBvcyA9IGdldFJhbmRvbVBvc2l0aW9uKCk7XG4gICAgICB9XG4gICAgICBib2FyZC5wbGFjZVNoaXAobmFtZSwgcG9zLngsIHBvcy55LCBwb3MuaG9yaXpvbnRhbCk7XG4gICAgICBzaGlwc1tuYW1lXSA9IHBvcztcbiAgICB9XG4gIH07XG5cbiAgbGV0IGdldFNoaXBQb3NpdGlvbiA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgcmV0dXJuIHNoaXBzW25hbWVdO1xuICB9O1xuXG4gIGxldCBnZXRHdWVzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgaSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJlbWFpbmluZ0d1ZXNzZXMubGVuZ3RoKTtcbiAgICBsZXQgZ3Vlc3MgPSByZW1haW5pbmdHdWVzc2VzW2ldO1xuICAgIGd1ZXNzLmlzSGl0ID0gZmFsc2U7XG4gICAgaGlzdG9yeS5wdXNoKGd1ZXNzKTtcbiAgICByZW1haW5pbmdHdWVzc2VzLnNwbGljZShpLCAxKTtcbiAgICByZXR1cm4gZ3Vlc3M7XG4gIH07XG5cbiAgbGV0IHNldEZlZWRiYWNrID0gZnVuY3Rpb24gKGlzSGl0KSB7XG4gICAgaGlzdG9yeVtoaXN0b3J5Lmxlbmd0aCAtIDFdLmlzSGl0ID0gaXNIaXQ7XG4gIH07XG5cbiAgbGV0IGdldEhpc3RvcnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFsuLi5oaXN0b3J5XTtcbiAgfTtcblxuICBsZXQgcmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgc2h1ZmZsZVNoaXBQb3NpdGlvbnMoKTtcbiAgICBoaXN0b3J5ID0gW107XG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBzaXplOyB4KyspIHtcbiAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgc2l6ZTsgeSsrKSB7XG4gICAgICAgIHJlbWFpbmluZ0d1ZXNzZXMucHVzaCh7IHgsIHkgfSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHJlc2V0KCk7XG4gIHJldHVybiB7IGdldEd1ZXNzLCBnZXRIaXN0b3J5LCBnZXRTaGlwUG9zaXRpb24sIHJlc2V0LCBzZXRGZWVkYmFjayB9O1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgQmF0dGxlc2hpcCBmcm9tICcuL0JhdHRsZXNoaXAnO1xuaW1wb3J0IERpc3BsYXkgZnJvbSAnLi9EaXNwbGF5JztcbmltcG9ydCBQbGF5ZXIgZnJvbSAnLi9QbGF5ZXInO1xuaW1wb3J0IFNpbXBsZUFJIGZyb20gJy4vU2ltcGxlQUknO1xuXG5sZXQgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcicpO1xubGV0IHBsYXllciA9IFBsYXllcigpO1xubGV0IG9wcG9uZW50ID0gU2ltcGxlQUkoKTtcbmxldCBiYXR0bGVzaGlwID0gQmF0dGxlc2hpcChwbGF5ZXIsIG9wcG9uZW50KTtcbmxldCBkaXNwbGF5ID0gRGlzcGxheShiYXR0bGVzaGlwLCBwbGF5ZXIsIG9wcG9uZW50LCBjb250YWluZXIpO1xuYmF0dGxlc2hpcC5vbkRyYXcgPSAoKSA9PiB7XG4gIGRpc3BsYXkuZHJhdygpO1xufTtcbmJhdHRsZXNoaXAub25HYW1lRW5kID0gKCkgPT4ge1xuICBkaXNwbGF5LmVuZEdhbWUoKTtcbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=