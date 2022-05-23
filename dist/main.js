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


function Battleship(player1, player2) {
  let obj = {};
  let size = 10;
  let p1Board = (0,_Board__WEBPACK_IMPORTED_MODULE_0__["default"])(size);
  let p2Board = (0,_Board__WEBPACK_IMPORTED_MODULE_0__["default"])(size);
  let isP1Turn = true;
  obj.onDraw = {};

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
    nextTurn();
  };

  obj.start = function () {
    isP1Turn = true;
    nextTurn();
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

  return {
    placeShip,
    removeShip,
    hit,
    isSunk,
    getShipInfo,
    isValidShipPlacement,
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
  playerDisplay.allowShipPlacement(true);
  let start = document.createElement('button');

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
    let shipyard = (0,_Shipyard__WEBPACK_IMPORTED_MODULE_2__["default"])(container, 'player');
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
        opponentDisplay.drawShip(name, battleship.getShipInfo(name, false));
      }
      playerDisplay.allowShipPlacement(false);
      battleship.start();
      start.classList.add('invisible');
    };
    startDiv.appendChild(start);
    container.appendChild(startDiv);
  };

  let setupInfo = function () {
    let info = document.createElement('div');
    info.classList.add('info');
    info.textContent = 'Place your ships!';
    container.appendChild(info);
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
  };

  let setup = function () {
    setupShipPlacement();
    setupGuessing();
    setupShipyard();
    (0,_Shipyard__WEBPACK_IMPORTED_MODULE_2__["default"])(container, 'opponent');
    setupStart();
    setupInfo();
  };

  setup();
  return { draw };
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

  return { getGuess, setGuess, getHistory, setFeedback };
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

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7OztBQ05zQztBQUNOO0FBQ0Y7QUFDSTs7QUFFbEM7QUFDQSxhQUFhLG1EQUFNO0FBQ25CLGVBQWUscURBQVE7QUFDdkIsaUJBQWlCLHVEQUFVO0FBQzNCLGNBQWMsb0RBQU87QUFDckI7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9CYXR0bGVzaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvQm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9EaXNwbGF5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvRGlzcGxheUJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvUGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvU2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL1NoaXBOYW1lcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL1NoaXB5YXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvU2ltcGxlQUkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJvYXJkIGZyb20gJy4vQm9hcmQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCYXR0bGVzaGlwKHBsYXllcjEsIHBsYXllcjIpIHtcbiAgbGV0IG9iaiA9IHt9O1xuICBsZXQgc2l6ZSA9IDEwO1xuICBsZXQgcDFCb2FyZCA9IEJvYXJkKHNpemUpO1xuICBsZXQgcDJCb2FyZCA9IEJvYXJkKHNpemUpO1xuICBsZXQgaXNQMVR1cm4gPSB0cnVlO1xuICBvYmoub25EcmF3ID0ge307XG5cbiAgbGV0IGlzVmFsaWRHdWVzcyA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgcmV0dXJuIHggPj0gMCAmJiB4IDwgc2l6ZSAmJiB5ID49IDAgJiYgeSA8IHNpemU7XG4gIH07XG5cbiAgb2JqLnBsYWNlU2hpcCA9IGZ1bmN0aW9uIChuYW1lLCB4LCB5LCBob3Jpem9udGFsLCBpc1BsYXllcjEpIHtcbiAgICBpZiAoaXNQbGF5ZXIxICYmIHAxQm9hcmQuaXNWYWxpZFNoaXBQbGFjZW1lbnQobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCkpXG4gICAgICBwMUJvYXJkLnBsYWNlU2hpcChuYW1lLCB4LCB5LCBob3Jpem9udGFsKTtcbiAgICBlbHNlIGlmIChwMkJvYXJkLmlzVmFsaWRTaGlwUGxhY2VtZW50KG5hbWUsIHgsIHksIGhvcml6b250YWwpKVxuICAgICAgcDJCb2FyZC5wbGFjZVNoaXAobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCk7XG4gIH07XG5cbiAgb2JqLmdldFNoaXBJbmZvID0gZnVuY3Rpb24gKG5hbWUsIGlzUGxheWVyMSkge1xuICAgIHJldHVybiBpc1BsYXllcjEgPyBwMUJvYXJkLmdldFNoaXBJbmZvKG5hbWUpIDogcDJCb2FyZC5nZXRTaGlwSW5mbyhuYW1lKTtcbiAgfTtcblxuICBsZXQgbmV4dFR1cm4gPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IG9wcG9uZW50Qm9hcmQgPSBpc1AxVHVybiA/IHAyQm9hcmQgOiBwMUJvYXJkO1xuICAgIGxldCBjdXJyZW50UGxheWVyID0gaXNQMVR1cm4gPyBwbGF5ZXIxIDogcGxheWVyMjtcbiAgICBsZXQgZ3Vlc3MgPSBhd2FpdCBjdXJyZW50UGxheWVyLmdldEd1ZXNzKCk7XG4gICAgaWYgKCFpc1ZhbGlkR3Vlc3MoZ3Vlc3MueCwgZ3Vlc3MueSkpXG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcbiAgICAgICAgYFBsYXllciAke2lzUDFUdXJuID8gJzEnIDogJzInfSBndWVzcyBpcyBpbnZhbGlkLiAoJHtndWVzc30pYFxuICAgICAgKTtcblxuICAgIGxldCBpc0hpdCA9IG9wcG9uZW50Qm9hcmQuaGl0KGd1ZXNzLngsIGd1ZXNzLnkpO1xuICAgIGN1cnJlbnRQbGF5ZXIuc2V0RmVlZGJhY2soaXNIaXQpO1xuICAgIGlmIChvYmoub25EcmF3IGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgIG9iai5vbkRyYXcoKTtcbiAgICB9XG4gICAgaXNQMVR1cm4gPSAhaXNQMVR1cm47XG4gICAgbmV4dFR1cm4oKTtcbiAgfTtcblxuICBvYmouc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaXNQMVR1cm4gPSB0cnVlO1xuICAgIG5leHRUdXJuKCk7XG4gIH07XG4gIHJldHVybiBvYmo7XG59XG4iLCJpbXBvcnQgU2hpcCBmcm9tICcuL1NoaXAnO1xuaW1wb3J0IFNoaXBOYW1lcyBmcm9tICcuL1NoaXBOYW1lcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJvYXJkKHNpemUpIHtcbiAgbGV0IHNoaXBzID0ge307XG4gIHNoaXBzW1NoaXBOYW1lcy5DYXJyaWVyXSA9IFNoaXAoNSk7XG4gIHNoaXBzW1NoaXBOYW1lcy5CYXR0bGVzaGlwXSA9IFNoaXAoNCk7XG4gIHNoaXBzW1NoaXBOYW1lcy5EZXN0cm95ZXJdID0gU2hpcCgzKTtcbiAgc2hpcHNbU2hpcE5hbWVzLlN1Ym1hcmluZV0gPSBTaGlwKDMpO1xuICBzaGlwc1tTaGlwTmFtZXMuUGF0cm9sQm9hdF0gPSBTaGlwKDIpO1xuICBsZXQgcGxhY2VkU2hpcHMgPSBbXTtcbiAgbGV0IHZhbGlkYXRlU2hpcEluZm8gPSBmdW5jdGlvbiAobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCkge1xuICAgIGlmIChzaGlwc1tuYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvcjogbmFtZSBtdXN0IGJlIGEgdmFsaWQgc2hpcCBuYW1lJyk7XG4gICAgaWYgKHggPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcigneCBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB6ZXJvJyk7XG4gICAgaWYgKHkgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcigneSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB6ZXJvJyk7XG4gICAgaWYgKGhvcml6b250YWwgJiYgeCArIHNoaXBzW25hbWVdLmdldExlbmd0aCgpIC0gMSA+PSBzaXplKVxuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXG4gICAgICAgIGB4ICR7XG4gICAgICAgICAgeCArIHNoaXBzW25hbWVdLmdldExlbmd0aCgpIC0gMVxuICAgICAgICB9IG11c3QgYmUgbGVzcyB0aGFuIHRoZSBzaXplIG9mIHRoZSBib2FyZCAoJHtzaXplfSlgXG4gICAgICApO1xuICAgIGlmICghaG9yaXpvbnRhbCAmJiB5ICsgc2hpcHNbbmFtZV0uZ2V0TGVuZ3RoKCkgLSAxID49IHNpemUpXG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcbiAgICAgICAgYHkgKCR7XG4gICAgICAgICAgeSArIHNoaXBzW25hbWVdLmdldExlbmd0aCgpIC0gMVxuICAgICAgICB9KSBtdXN0IGJlIGxlc3MgdGhhbiB0aGUgc2l6ZSBvZiB0aGUgYm9hcmQgKCR7c2l6ZX0pYFxuICAgICAgKTtcbiAgfTtcblxuICBsZXQgaXNWYWxpZFNoaXBQbGFjZW1lbnQgPSBmdW5jdGlvbiAobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCkge1xuICAgIGlmIChzaGlwc1tuYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvcjogbmFtZSBtdXN0IGJlIGEgdmFsaWQgc2hpcCBuYW1lJyk7XG4gICAgbGV0IGxlZnQgPSB4O1xuICAgIGxldCB0b3AgPSB5O1xuICAgIGxldCByaWdodCA9IGhvcml6b250YWwgPyBsZWZ0ICsgc2hpcHNbbmFtZV0uZ2V0TGVuZ3RoKCkgLSAxIDogbGVmdDtcbiAgICBsZXQgYm90dG9tID0gaG9yaXpvbnRhbCA/IHRvcCA6IHRvcCArIHNoaXBzW25hbWVdLmdldExlbmd0aCgpIC0gMTtcbiAgICBpZiAobGVmdCA8IDAgfHwgcmlnaHQgPCAwIHx8IHJpZ2h0ID49IHNpemUgfHwgYm90dG9tID49IHNpemUpIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiAhcGxhY2VkU2hpcHMuc29tZSgodmFsKSA9PiB7XG4gICAgICBpZiAodmFsICE9PSBuYW1lKSB7XG4gICAgICAgIGxldCBsID0gc2hpcHNbdmFsXS5nZXRPcmlnaW4oKS54O1xuICAgICAgICBsZXQgdCA9IHNoaXBzW3ZhbF0uZ2V0T3JpZ2luKCkueTtcbiAgICAgICAgbGV0IHIgPSBzaGlwc1t2YWxdLmlzSG9yaXpvbnRhbCgpID8gbCArIHNoaXBzW3ZhbF0uZ2V0TGVuZ3RoKCkgLSAxIDogbDtcbiAgICAgICAgbGV0IGIgPSBzaGlwc1t2YWxdLmlzSG9yaXpvbnRhbCgpID8gdCA6IHQgKyBzaGlwc1t2YWxdLmdldExlbmd0aCgpIC0gMTtcbiAgICAgICAgLy8gc2hpcHMgY29sbGlkZVxuICAgICAgICBpZiAoXG4gICAgICAgICAgKChsZWZ0ID49IGwgJiYgbGVmdCA8PSByKSB8fCAocmlnaHQgPj0gbCAmJiByaWdodCA8PSByKSkgJiZcbiAgICAgICAgICAoKHRvcCA+PSB0ICYmIHRvcCA8PSBiKSB8fCAoYm90dG9tID49IHQgJiYgYm90dG9tIDw9IGIpKVxuICAgICAgICApIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGxldCBwbGFjZVNoaXAgPSBmdW5jdGlvbiAobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCkge1xuICAgIHZhbGlkYXRlU2hpcEluZm8obmFtZSwgeCwgeSwgaG9yaXpvbnRhbCk7XG4gICAgaWYgKCFpc1ZhbGlkU2hpcFBsYWNlbWVudChuYW1lLCB4LCB5LCBob3Jpem9udGFsKSkgcmV0dXJuIGZhbHNlO1xuICAgIHNoaXBzW25hbWVdLnNldE9yaWdpbih4LCB5KTtcbiAgICBzaGlwc1tuYW1lXS5zZXRIb3Jpem9udGFsKGhvcml6b250YWwpO1xuICAgIGlmICghcGxhY2VkU2hpcHMuaW5jbHVkZXMobmFtZSkpIHBsYWNlZFNoaXBzLnB1c2gobmFtZSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgbGV0IHJlbW92ZVNoaXAgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIGlmIChzaGlwc1tuYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvcjogbmFtZSBtdXN0IGJlIGEgdmFsaWQgc2hpcCBuYW1lJyk7XG4gICAgcGxhY2VkU2hpcHMgPSBwbGFjZWRTaGlwcy5maWx0ZXIoKHYpID0+IHYgIT09IG5hbWUpO1xuICAgIHNoaXBzW25hbWVdLnJlc2V0SGl0cygpO1xuICB9O1xuXG4gIGxldCBoaXQgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgIGZvciAoY29uc3QgbmFtZSBpbiBzaGlwcykge1xuICAgICAgaWYgKHBsYWNlZFNoaXBzLmluY2x1ZGVzKG5hbWUpICYmIHNoaXBzW25hbWVdLmhpdCh4LCB5KSkgcmV0dXJuIG5hbWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBsZXQgaXNTdW5rID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBpZiAoc2hpcHNbbmFtZV0gPT09IHVuZGVmaW5lZClcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3I6IG5hbWUgbXVzdCBiZSBhIHZhbGlkIHNoaXAgbmFtZScpO1xuICAgIHJldHVybiBzaGlwc1tuYW1lXS5pc1N1bmsoKTtcbiAgfTtcblxuICBsZXQgZ2V0U2hpcEluZm8gPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIGlmIChzaGlwc1tuYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvcjogbmFtZSBtdXN0IGJlIGEgdmFsaWQgc2hpcCBuYW1lJyk7XG4gICAgaWYgKCFwbGFjZWRTaGlwcy5pbmNsdWRlcyhuYW1lKSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICByZXR1cm4ge1xuICAgICAgb3JpZ2luOiBzaGlwc1tuYW1lXS5nZXRPcmlnaW4oKSxcbiAgICAgIGhvcml6b250YWw6IHNoaXBzW25hbWVdLmlzSG9yaXpvbnRhbCgpLFxuICAgICAgc3Vuazogc2hpcHNbbmFtZV0uaXNTdW5rKCksXG4gICAgICBsZW5ndGg6IHNoaXBzW25hbWVdLmdldExlbmd0aCgpLFxuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBwbGFjZVNoaXAsXG4gICAgcmVtb3ZlU2hpcCxcbiAgICBoaXQsXG4gICAgaXNTdW5rLFxuICAgIGdldFNoaXBJbmZvLFxuICAgIGlzVmFsaWRTaGlwUGxhY2VtZW50LFxuICB9O1xufVxuIiwiaW1wb3J0IERpc3BsYXlCb2FyZCBmcm9tICcuL0Rpc3BsYXlCb2FyZCc7XG5pbXBvcnQgU2hpcE5hbWVzIGZyb20gJy4vU2hpcE5hbWVzJztcbmltcG9ydCBTaGlweWFyZCBmcm9tICcuL1NoaXB5YXJkJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRGlzcGxheShiYXR0bGVzaGlwLCBwbGF5ZXIsIG9wcG9uZW50LCBjb250YWluZXIpIHtcbiAgbGV0IG9wcG9uZW50RGlzcGxheSA9IERpc3BsYXlCb2FyZChjb250YWluZXIsICdvcHBvbmVudCcpO1xuICBvcHBvbmVudERpc3BsYXkuYWxsb3dTaGlwUGxhY2VtZW50KGZhbHNlKTtcbiAgbGV0IHBsYXllckRpc3BsYXkgPSBEaXNwbGF5Qm9hcmQoY29udGFpbmVyLCAncGxheWVyJyk7XG4gIHBsYXllckRpc3BsYXkuYWxsb3dTaGlwUGxhY2VtZW50KHRydWUpO1xuICBsZXQgc3RhcnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcblxuICBsZXQgaXNBbGxTaGlwc1BsYWNlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoU2hpcE5hbWVzKS5ldmVyeShcbiAgICAgIChuYW1lKSA9PiBiYXR0bGVzaGlwLmdldFNoaXBJbmZvKG5hbWUsIHRydWUpICE9PSB1bmRlZmluZWRcbiAgICApO1xuICB9O1xuXG4gIGxldCBzZXR1cFNoaXBQbGFjZW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcGxheWVyRGlzcGxheS5vbkNlbGxEcm9wID0gKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGxldCBpbmZvID0gSlNPTi5wYXJzZShlLmRhdGFUcmFuc2Zlci5nZXREYXRhKCd0ZXh0JykpO1xuICAgICAgbGV0IG9yaWdpbiA9IHBsYXllckRpc3BsYXkuY2VsbEZyb21Qb2ludChcbiAgICAgICAgZS54IC0gZS5vZmZzZXRYIC0gaW5mby5vZmZzZXRYICsgMjUsXG4gICAgICAgIGUueSAtIGUub2Zmc2V0WSAtIGluZm8ub2Zmc2V0WSArIDI1XG4gICAgICApO1xuICAgICAgaWYgKG9yaWdpbiAhPT0gdW5kZWZpbmVkKVxuICAgICAgICBiYXR0bGVzaGlwLnBsYWNlU2hpcChcbiAgICAgICAgICBpbmZvLm5hbWUsXG4gICAgICAgICAgb3JpZ2luLngsXG4gICAgICAgICAgb3JpZ2luLnksXG4gICAgICAgICAgaW5mby5ob3Jpem9udGFsLFxuICAgICAgICAgIHRydWVcbiAgICAgICAgKTtcbiAgICAgIHBsYXllckRpc3BsYXkuZHJhd1NoaXAoXG4gICAgICAgIGluZm8ubmFtZSxcbiAgICAgICAgYmF0dGxlc2hpcC5nZXRTaGlwSW5mbyhpbmZvLm5hbWUsIHRydWUpXG4gICAgICApO1xuICAgICAgaWYgKGlzQWxsU2hpcHNQbGFjZWQoKSkgc3RhcnQuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9O1xuICB9O1xuICBsZXQgc2V0dXBHdWVzc2luZyA9IGZ1bmN0aW9uICgpIHtcbiAgICBvcHBvbmVudERpc3BsYXkub25DZWxsQ2xpY2sgPSAoZSkgPT4ge1xuICAgICAgbGV0IG9yaWdpbiA9IG9wcG9uZW50RGlzcGxheS5jZWxsRnJvbVBvaW50KFxuICAgICAgICBlLnggLSBlLm9mZnNldFgsXG4gICAgICAgIGUueSAtIGUub2Zmc2V0WVxuICAgICAgKTtcbiAgICAgIHBsYXllci5zZXRHdWVzcyhvcmlnaW4ueCwgb3JpZ2luLnkpO1xuICAgIH07XG4gIH07XG5cbiAgbGV0IHNldHVwU2hpcHlhcmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHNoaXB5YXJkID0gU2hpcHlhcmQoY29udGFpbmVyLCAncGxheWVyJyk7XG4gICAgc2hpcHlhcmQub25TaGlwRHJhZ1N0YXJ0ID0gKGUsIG5hbWUpID0+IHtcbiAgICAgIGxldCBpbmZvID0gYmF0dGxlc2hpcC5nZXRTaGlwSW5mbyhuYW1lLCB0cnVlKTtcbiAgICAgIGxldCBob3Jpem9udGFsID0gaW5mbyA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBpbmZvLmhvcml6b250YWw7XG4gICAgICBlLmRhdGFUcmFuc2Zlci5zZXREYXRhKFxuICAgICAgICAndGV4dCcsXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgIG9mZnNldFg6IGUub2Zmc2V0WCxcbiAgICAgICAgICBvZmZzZXRZOiBlLm9mZnNldFksXG4gICAgICAgICAgaG9yaXpvbnRhbDogaG9yaXpvbnRhbCxcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfTtcbiAgICBzaGlweWFyZC5vblNoaXBDbGljayA9IChlLCBuYW1lKSA9PiB7XG4gICAgICBsZXQgaW5mbyA9IGJhdHRsZXNoaXAuZ2V0U2hpcEluZm8obmFtZSwgdHJ1ZSk7XG4gICAgICBpZiAoaW5mbyA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG4gICAgICBiYXR0bGVzaGlwLnBsYWNlU2hpcChcbiAgICAgICAgbmFtZSxcbiAgICAgICAgaW5mby5vcmlnaW4ueCxcbiAgICAgICAgaW5mby5vcmlnaW4ueSxcbiAgICAgICAgIWluZm8uaG9yaXpvbnRhbCxcbiAgICAgICAgdHJ1ZVxuICAgICAgKTtcbiAgICAgIHBsYXllckRpc3BsYXkuZHJhd1NoaXAobmFtZSwgYmF0dGxlc2hpcC5nZXRTaGlwSW5mbyhuYW1lLCB0cnVlKSk7XG4gICAgfTtcbiAgfTtcblxuICBsZXQgc2V0dXBTdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgc3RhcnREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBzdGFydERpdi5jbGFzc0xpc3QuYWRkKCdzdGFydERpdicpO1xuICAgIHN0YXJ0LmNsYXNzTGlzdC5hZGQoJ3N0YXJ0Jyk7XG4gICAgc3RhcnQuZGlzYWJsZWQgPSB0cnVlO1xuICAgIHN0YXJ0LnRleHRDb250ZW50ID0gJ1N0YXJ0IEdhbWUnO1xuICAgIHN0YXJ0Lm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IG5hbWUgaW4gU2hpcE5hbWVzKSB7XG4gICAgICAgIGxldCBwb3MgPSBvcHBvbmVudC5nZXRTaGlwUG9zaXRpb24obmFtZSk7XG4gICAgICAgIGJhdHRsZXNoaXAucGxhY2VTaGlwKG5hbWUsIHBvcy54LCBwb3MueSwgcG9zLmhvcml6b250YWwsIGZhbHNlKTtcbiAgICAgICAgb3Bwb25lbnREaXNwbGF5LmRyYXdTaGlwKG5hbWUsIGJhdHRsZXNoaXAuZ2V0U2hpcEluZm8obmFtZSwgZmFsc2UpKTtcbiAgICAgIH1cbiAgICAgIHBsYXllckRpc3BsYXkuYWxsb3dTaGlwUGxhY2VtZW50KGZhbHNlKTtcbiAgICAgIGJhdHRsZXNoaXAuc3RhcnQoKTtcbiAgICAgIHN0YXJ0LmNsYXNzTGlzdC5hZGQoJ2ludmlzaWJsZScpO1xuICAgIH07XG4gICAgc3RhcnREaXYuYXBwZW5kQ2hpbGQoc3RhcnQpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChzdGFydERpdik7XG4gIH07XG5cbiAgbGV0IHNldHVwSW5mbyA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgaW5mbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGluZm8uY2xhc3NMaXN0LmFkZCgnaW5mbycpO1xuICAgIGluZm8udGV4dENvbnRlbnQgPSAnUGxhY2UgeW91ciBzaGlwcyEnO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChpbmZvKTtcbiAgfTtcblxuICBsZXQgZHJhd1NoaXBzID0gZnVuY3Rpb24gKCkge1xuICAgIGZvciAoY29uc3QgbmFtZSBpbiBTaGlwTmFtZXMpIHtcbiAgICAgIHBsYXllckRpc3BsYXkuZHJhd1NoaXAobmFtZSwgYmF0dGxlc2hpcC5nZXRTaGlwSW5mbyhuYW1lLCB0cnVlKSk7XG4gICAgfVxuICB9O1xuXG4gIGxldCBkcmF3R3Vlc3NlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICBwbGF5ZXIuZ2V0SGlzdG9yeSgpLmZvckVhY2goKGUpID0+IHtcbiAgICAgIG9wcG9uZW50RGlzcGxheS5kcmF3R3Vlc3MoZS54LCBlLnksIGUuaXNIaXQpO1xuICAgIH0pO1xuXG4gICAgb3Bwb25lbnQuZ2V0SGlzdG9yeSgpLmZvckVhY2goKGUpID0+IHtcbiAgICAgIHBsYXllckRpc3BsYXkuZHJhd0d1ZXNzKGUueCwgZS55LCBlLmlzSGl0KTtcbiAgICB9KTtcbiAgfTtcblxuICBsZXQgZHJhdyA9IGZ1bmN0aW9uICgpIHtcbiAgICBkcmF3U2hpcHMoKTtcbiAgICBkcmF3R3Vlc3NlcygpO1xuICB9O1xuXG4gIGxldCBzZXR1cCA9IGZ1bmN0aW9uICgpIHtcbiAgICBzZXR1cFNoaXBQbGFjZW1lbnQoKTtcbiAgICBzZXR1cEd1ZXNzaW5nKCk7XG4gICAgc2V0dXBTaGlweWFyZCgpO1xuICAgIFNoaXB5YXJkKGNvbnRhaW5lciwgJ29wcG9uZW50Jyk7XG4gICAgc2V0dXBTdGFydCgpO1xuICAgIHNldHVwSW5mbygpO1xuICB9O1xuXG4gIHNldHVwKCk7XG4gIHJldHVybiB7IGRyYXcgfTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIERpc3BsYXlCb2FyZChjb250YWluZXIsIG5hbWUpIHtcbiAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBkaXYuY2xhc3NMaXN0LmFkZCgnYm9hcmQnKTtcbiAgbGV0IGltYWdlRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGltYWdlRGl2LmNsYXNzTGlzdC5hZGQoJ2dyaWQnKTtcbiAgZGl2LmFwcGVuZENoaWxkKGltYWdlRGl2KTtcblxuICBsZXQgZGlzcGxheUJvYXJkID0ge307XG4gIGRpc3BsYXlCb2FyZC5vbkNlbGxEcm9wID0ge307XG4gIGRpc3BsYXlCb2FyZC5vbkNlbGxDbGljayA9IHt9O1xuICBkaXNwbGF5Qm9hcmQuY2VsbEZyb21Qb2ludCA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgbGV0IGNlbGwgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KHgsIHkpO1xuICAgIGlmIChjZWxsLmNsYXNzTGlzdC5jb250YWlucygnY2VsbCcpICYmIGRpdi5jb250YWlucyhjZWxsKSlcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKGNlbGwuaWQpO1xuICAgIGVsc2UgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfTtcblxuICBkaXNwbGF5Qm9hcmQuYWxsb3dTaGlwUGxhY2VtZW50ID0gZnVuY3Rpb24gKGFsbG93KSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaXYuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBjZWxsID0gZGl2LmNoaWxkcmVuW2ldO1xuICAgICAgaWYgKGNlbGwuY2xhc3NMaXN0LmNvbnRhaW5zKCdjZWxsJykgJiYgZGl2LmNvbnRhaW5zKGNlbGwpKSB7XG4gICAgICAgIGlmIChhbGxvdykgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKCdjZWxsRm9yd2FyZCcpO1xuICAgICAgICBlbHNlIGNlbGwuY2xhc3NMaXN0LmFkZCgnY2VsbEZvcndhcmQnKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgZGlzcGxheUJvYXJkLmRyYXdTaGlwID0gZnVuY3Rpb24gKHNoaXBOYW1lLCBpbmZvKSB7XG4gICAgaWYgKGluZm8gIT0gdW5kZWZpbmVkKSB7XG4gICAgICBsZXQgc2hpcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWUgKyBzaGlwTmFtZSk7XG4gICAgICBsZXQgcmlnaHQgPSBpbmZvLm9yaWdpbi54ICsgMztcbiAgICAgIGxldCBib3R0b20gPSBpbmZvLm9yaWdpbi55ICsgMztcbiAgICAgIGlmIChpbmZvLmhvcml6b250YWwpIHtcbiAgICAgICAgcmlnaHQgKz0gaW5mby5sZW5ndGggLSAxO1xuICAgICAgICBzaGlwLmNsYXNzTGlzdC5yZW1vdmUoJ3ZlcnRpY2FsU2hpcCcpO1xuICAgICAgICBzaGlwLmNsYXNzTGlzdC5hZGQoJ2hvcml6b250YWxTaGlwJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBib3R0b20gKz0gaW5mby5sZW5ndGggLSAxO1xuICAgICAgICBzaGlwLmNsYXNzTGlzdC5yZW1vdmUoJ2hvcml6b250YWxTaGlwJyk7XG4gICAgICAgIHNoaXAuY2xhc3NMaXN0LmFkZCgndmVydGljYWxTaGlwJyk7XG4gICAgICB9XG4gICAgICBzaGlwLnN0eWxlLmdyaWRBcmVhID0gYFxuICAgICAgICAgICAgJHtpbmZvLm9yaWdpbi55ICsgMn0gL1xuICAgICAgICAgICAgJHtpbmZvLm9yaWdpbi54ICsgMn0gL1xuICAgICAgICAgICAgJHtib3R0b219IC9cbiAgICAgICAgICAgICR7cmlnaHR9YDtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChzaGlwKTtcbiAgICB9XG4gIH07XG5cbiAgZGlzcGxheUJvYXJkLmRyYXdHdWVzcyA9IGZ1bmN0aW9uICh4LCB5LCBpc0hpdCkge1xuICAgIGxldCBjZWxsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoSlNPTi5zdHJpbmdpZnkoeyBuYW1lLCB4LCB5IH0pKTtcbiAgICBjZWxsLnRleHRDb250ZW50ID0gaXNIaXQgPyAnWCcgOiAnMCc7XG4gIH07XG5cbiAgbGV0IHNldHVwQ2VsbHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPCAxMTsgeSsrKSB7XG4gICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDExOyB4KyspIHtcbiAgICAgICAgbGV0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgY2VsbC5pZCA9IEpTT04uc3RyaW5naWZ5KHsgbmFtZSwgeDogeCAtIDEsIHk6IHkgLSAxIH0pO1xuICAgICAgICBjZWxsLnN0eWxlLmdyaWRBcmVhID0gYCR7eSArIDF9IC8gJHt4ICsgMX0gLyAke3kgKyAyfSAvICR7eCArIDJ9YDtcbiAgICAgICAgaWYgKHkgPT09IDAgJiYgeCA+IDApIHtcbiAgICAgICAgICBjZWxsLnRleHRDb250ZW50ID0gU3RyaW5nLmZyb21DaGFyQ29kZSg2NCArIHgpO1xuICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnbGFiZWxDZWxsJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoeCA9PT0gMCAmJiB5ID4gMCkge1xuICAgICAgICAgIGNlbGwudGV4dENvbnRlbnQgPSB5LnRvU3RyaW5nKCk7XG4gICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKCdsYWJlbENlbGwnKTtcbiAgICAgICAgfSBlbHNlIGlmICh4ID4gMCAmJiB5ID4gMCkge1xuICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnY2VsbCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2VsbC5vbmRyYWdvdmVyID0gKGUpID0+IGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY2VsbC5vbmRyb3AgPSAoZSkgPT4ge1xuICAgICAgICAgIGlmIChkaXNwbGF5Qm9hcmQub25DZWxsRHJvcCBpbnN0YW5jZW9mIEZ1bmN0aW9uKVxuICAgICAgICAgICAgZGlzcGxheUJvYXJkLm9uQ2VsbERyb3AoZSwgeCArIDEsIHkgKyAxKTtcbiAgICAgICAgfTtcbiAgICAgICAgY2VsbC5vbmNsaWNrID0gKGUpID0+IHtcbiAgICAgICAgICBpZiAoZGlzcGxheUJvYXJkLm9uQ2VsbENsaWNrIGluc3RhbmNlb2YgRnVuY3Rpb24pXG4gICAgICAgICAgICBkaXNwbGF5Qm9hcmQub25DZWxsQ2xpY2soZSwgeCArIDEsIHkgKyAxKTtcbiAgICAgICAgfTtcbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKGNlbGwpO1xuICAgICAgfVxuICAgIH1cbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgfTtcblxuICBzZXR1cENlbGxzKCk7XG4gIHJldHVybiBkaXNwbGF5Qm9hcmQ7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBQbGF5ZXIoKSB7XG4gIGxldCBndWVzcyA9IHVuZGVmaW5lZDtcbiAgbGV0IGhpc3RvcnkgPSBbXTtcblxuICBsZXQgZ2V0R3Vlc3MgPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgd2hpbGUgKGd1ZXNzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gcmVzb2x2ZSgpLCA1MCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgbGV0IHJldCA9IHsgeDogZ3Vlc3MueCwgeTogZ3Vlc3MueSwgaXNIaXQ6IGZhbHNlIH07XG4gICAgaGlzdG9yeS5wdXNoKHJldCk7XG4gICAgZ3Vlc3MgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJldDtcbiAgfTtcblxuICBsZXQgc2V0R3Vlc3MgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgIGd1ZXNzID0geyB4OiB4LCB5OiB5IH07XG4gIH07XG5cbiAgbGV0IHNldEZlZWRiYWNrID0gZnVuY3Rpb24gKGlzSGl0KSB7XG4gICAgaGlzdG9yeVtoaXN0b3J5Lmxlbmd0aCAtIDFdLmlzSGl0ID0gaXNIaXQ7XG4gIH07XG5cbiAgbGV0IGdldEhpc3RvcnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFsuLi5oaXN0b3J5XTtcbiAgfTtcblxuICByZXR1cm4geyBnZXRHdWVzcywgc2V0R3Vlc3MsIGdldEhpc3RvcnksIHNldEZlZWRiYWNrIH07XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTaGlwKGxlbmd0aCkge1xuICBpZiAoIU51bWJlci5pc0ludGVnZXIobGVuZ3RoKSlcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdsZW5ndGggbXVzdCBiZSBhbiBpbnRlZ2VyJyk7XG4gIGVsc2UgaWYgKGxlbmd0aCA8IDApXG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1NoaXAgbGVuZ3RoIGNhbm5vdCBiZSBsZXNzIHRoYW4gemVybycpO1xuICBsZXQgeCA9IDA7XG4gIGxldCB5ID0gMDtcbiAgbGV0IGhvcml6b250YWwgPSBmYWxzZTtcbiAgbGV0IGhpdHMgPSBbXTtcblxuICBsZXQgZ2V0TGVuZ3RoID0gKCkgPT4ge1xuICAgIHJldHVybiBsZW5ndGg7XG4gIH07XG5cbiAgbGV0IHNldE9yaWdpbiA9IChuZXdYLCBuZXdZKSA9PiB7XG4gICAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKG5ld1gpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCd4IG11c3QgYmUgYW4gaW50ZWdlcicpO1xuICAgIGVsc2UgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKG5ld1kpKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigneSBtdXN0IGJlIGFuIGludGVnZXInKTtcblxuICAgIHggPSBuZXdYO1xuICAgIHkgPSBuZXdZO1xuICB9O1xuXG4gIGxldCBnZXRPcmlnaW4gPSAoKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHgsXG4gICAgICB5LFxuICAgIH07XG4gIH07XG5cbiAgbGV0IGlzSG9yaXpvbnRhbCA9ICgpID0+IHtcbiAgICByZXR1cm4gaG9yaXpvbnRhbDtcbiAgfTtcblxuICBsZXQgc2V0SG9yaXpvbnRhbCA9ICh2YWx1ZSkgPT4ge1xuICAgIGhvcml6b250YWwgPSAhIXZhbHVlO1xuICB9O1xuXG4gIGxldCBoaXQgPSAodGFyZ2V0WCwgdGFyZ2V0WSkgPT4ge1xuICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcih0YXJnZXRYKSlcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3RhcmdldFggbXVzdCBiZSBhbiBpbnRlZ2VyJyk7XG4gICAgZWxzZSBpZiAoIU51bWJlci5pc0ludGVnZXIodGFyZ2V0WSkpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0YXJnZXRZIG11c3QgYmUgYW4gaW50ZWdlcicpO1xuXG4gICAgbGV0IHN1Y2Nlc3MgPVxuICAgICAgKGhvcml6b250YWwgJiYgeSA9PT0gdGFyZ2V0WSAmJiB0YXJnZXRYID49IHggJiYgdGFyZ2V0WCA8IHggKyBsZW5ndGgpIHx8XG4gICAgICAoIWhvcml6b250YWwgJiYgeCA9PT0gdGFyZ2V0WCAmJiB0YXJnZXRZID49IHkgJiYgdGFyZ2V0WSA8IHkgKyBsZW5ndGgpO1xuICAgIGlmIChzdWNjZXNzKSBoaXRzLnB1c2goeyB4OiB0YXJnZXRYLCB5OiB0YXJnZXRZIH0pO1xuICAgIHJldHVybiBzdWNjZXNzO1xuICB9O1xuXG4gIGxldCBpc1N1bmsgPSAoKSA9PiB7XG4gICAgaWYgKGhpdHMubGVuZ3RoID09PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIGhpdHMuZXZlcnkoKHYpID0+IHtcbiAgICAgIGlmIChob3Jpem9udGFsKSByZXR1cm4gdi55ID09PSB5ICYmIHYueCA+PSB4ICYmIHYueCA8IHggKyBsZW5ndGg7XG4gICAgICBlbHNlIHJldHVybiB2LnggPT09IHggJiYgdi55ID49IHkgJiYgdi55IDwgeSArIGxlbmd0aDtcbiAgICB9KTtcbiAgfTtcblxuICBsZXQgcmVzZXRIaXRzID0gKCkgPT4gKGhpdHMubGVuZ3RoID0gMCk7XG4gIHJldHVybiB7XG4gICAgZ2V0TGVuZ3RoLFxuICAgIGdldE9yaWdpbixcbiAgICBzZXRPcmlnaW4sXG4gICAgaXNIb3Jpem9udGFsLFxuICAgIHNldEhvcml6b250YWwsXG4gICAgaGl0LFxuICAgIGlzU3VuayxcbiAgICByZXNldEhpdHMsXG4gIH07XG59XG4iLCJleHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24gU2hpcE5hbWVzKCkge1xuICByZXR1cm4ge1xuICAgIENhcnJpZXI6ICdDYXJyaWVyJyxcbiAgICBCYXR0bGVzaGlwOiAnQmF0dGxlc2hpcCcsXG4gICAgRGVzdHJveWVyOiAnRGVzdHJveWVyJyxcbiAgICBTdWJtYXJpbmU6ICdTdWJtYXJpbmUnLFxuICAgIFBhdHJvbEJvYXQ6ICdQYXRyb2xCb2F0JyxcbiAgfTtcbn0pKCk7XG4iLCJpbXBvcnQgU2hpcE5hbWVzIGZyb20gJy4vU2hpcE5hbWVzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2hpcHlhcmQoY29udGFpbmVyLCBuYW1lKSB7XG4gIGxldCBzaGlweWFyZCA9IHt9O1xuICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdi5jbGFzc0xpc3QuYWRkKG5hbWUgKyAnc2hpcHlhcmQnKTtcbiAgc2hpcHlhcmQub25TaGlwQ2xpY2sgPSB7fTtcbiAgc2hpcHlhcmQub25TaGlwRHJhZ1N0YXJ0ID0ge307XG5cbiAgZm9yIChjb25zdCBzaGlwTmFtZSBpbiBTaGlwTmFtZXMpIHtcbiAgICBsZXQgc2hpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHNoaXAuY2xhc3NMaXN0LmFkZChzaGlwTmFtZSk7XG4gICAgc2hpcC5pZCA9IG5hbWUgKyBzaGlwTmFtZTtcbiAgICBzaGlwLmNsYXNzTGlzdC5hZGQoJ3NoaXAnKTtcbiAgICBzaGlwLmNsYXNzTGlzdC5hZGQoJ3ZlcnRpY2FsU2hpcCcpO1xuICAgIHNoaXAuc3R5bGUuZ3JpZEFyZWEgPSBzaGlwTmFtZTtcbiAgICBzaGlwLmRyYWdnYWJsZSA9IHRydWU7XG4gICAgc2hpcC5vbmRyYWdzdGFydCA9IChlKSA9PiB7XG4gICAgICBpZiAoc2hpcHlhcmQub25TaGlwRHJhZ1N0YXJ0IGluc3RhbmNlb2YgRnVuY3Rpb24pXG4gICAgICAgIHNoaXB5YXJkLm9uU2hpcERyYWdTdGFydChlLCBzaGlwTmFtZSk7XG4gICAgfTtcbiAgICBzaGlwLm9uY2xpY2sgPSAoZSkgPT4ge1xuICAgICAgaWYgKHNoaXB5YXJkLm9uU2hpcENsaWNrIGluc3RhbmNlb2YgRnVuY3Rpb24pXG4gICAgICAgIHNoaXB5YXJkLm9uU2hpcENsaWNrKGUsIHNoaXBOYW1lKTtcbiAgICB9O1xuICAgIHNoaXAudGV4dENvbnRlbnQgPSBzaGlwTmFtZTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoc2hpcCk7XG4gIH1cbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRpdik7XG4gIHJldHVybiBzaGlweWFyZDtcbn1cbiIsImltcG9ydCBCb2FyZCBmcm9tICcuL0JvYXJkJztcbmltcG9ydCBTaGlwTmFtZXMgZnJvbSAnLi9TaGlwTmFtZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTaW1wbGVBSSgpIHtcbiAgbGV0IHNpemUgPSAxMDtcbiAgbGV0IHJlbWFpbmluZ0d1ZXNzZXMgPSBbXTtcbiAgbGV0IGhpc3RvcnkgPSBbXTtcbiAgbGV0IHNoaXBzID0ge307XG5cbiAgbGV0IGdldFJhbmRvbVBvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCBtaW4gPSAwO1xuICAgIGxldCBtYXggPSBzaXplO1xuICAgIHJldHVybiB7XG4gICAgICB4OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluLFxuICAgICAgeTogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbixcbiAgICAgIGhvcml6b250YWw6IE1hdGgucmFuZG9tKCkgPCAwLjUsXG4gICAgfTtcbiAgfTtcblxuICBsZXQgc2h1ZmZsZVNoaXBQb3NpdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGJvYXJkID0gQm9hcmQoc2l6ZSk7XG5cbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gU2hpcE5hbWVzKSB7XG4gICAgICBsZXQgcG9zID0gZ2V0UmFuZG9tUG9zaXRpb24oKTtcbiAgICAgIHdoaWxlICghYm9hcmQuaXNWYWxpZFNoaXBQbGFjZW1lbnQobmFtZSwgcG9zLngsIHBvcy55LCBwb3MuaG9yaXpvbnRhbCkpIHtcbiAgICAgICAgcG9zID0gZ2V0UmFuZG9tUG9zaXRpb24oKTtcbiAgICAgIH1cbiAgICAgIGJvYXJkLnBsYWNlU2hpcChuYW1lLCBwb3MueCwgcG9zLnksIHBvcy5ob3Jpem9udGFsKTtcbiAgICAgIHNoaXBzW25hbWVdID0gcG9zO1xuICAgIH1cbiAgfTtcblxuICBsZXQgZ2V0U2hpcFBvc2l0aW9uID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICByZXR1cm4gc2hpcHNbbmFtZV07XG4gIH07XG5cbiAgbGV0IGdldEd1ZXNzID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCBpID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmVtYWluaW5nR3Vlc3Nlcy5sZW5ndGgpO1xuICAgIGxldCBndWVzcyA9IHJlbWFpbmluZ0d1ZXNzZXNbaV07XG4gICAgZ3Vlc3MuaXNIaXQgPSBmYWxzZTtcbiAgICBoaXN0b3J5LnB1c2goZ3Vlc3MpO1xuICAgIHJlbWFpbmluZ0d1ZXNzZXMuc3BsaWNlKGksIDEpO1xuICAgIHJldHVybiBndWVzcztcbiAgfTtcblxuICBsZXQgc2V0RmVlZGJhY2sgPSBmdW5jdGlvbiAoaXNIaXQpIHtcbiAgICBoaXN0b3J5W2hpc3RvcnkubGVuZ3RoIC0gMV0uaXNIaXQgPSBpc0hpdDtcbiAgfTtcblxuICBsZXQgZ2V0SGlzdG9yeSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gWy4uLmhpc3RvcnldO1xuICB9O1xuXG4gIGxldCByZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICBzaHVmZmxlU2hpcFBvc2l0aW9ucygpO1xuICAgIGZvciAobGV0IHggPSAwOyB4IDwgc2l6ZTsgeCsrKSB7XG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHNpemU7IHkrKykge1xuICAgICAgICByZW1haW5pbmdHdWVzc2VzLnB1c2goeyB4LCB5IH0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICByZXNldCgpO1xuICByZXR1cm4geyBnZXRHdWVzcywgZ2V0SGlzdG9yeSwgZ2V0U2hpcFBvc2l0aW9uLCByZXNldCwgc2V0RmVlZGJhY2sgfTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEJhdHRsZXNoaXAgZnJvbSAnLi9CYXR0bGVzaGlwJztcbmltcG9ydCBEaXNwbGF5IGZyb20gJy4vRGlzcGxheSc7XG5pbXBvcnQgUGxheWVyIGZyb20gJy4vUGxheWVyJztcbmltcG9ydCBTaW1wbGVBSSBmcm9tICcuL1NpbXBsZUFJJztcblxubGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWluZXInKTtcbmxldCBwbGF5ZXIgPSBQbGF5ZXIoKTtcbmxldCBvcHBvbmVudCA9IFNpbXBsZUFJKCk7XG5sZXQgYmF0dGxlc2hpcCA9IEJhdHRsZXNoaXAocGxheWVyLCBvcHBvbmVudCk7XG5sZXQgZGlzcGxheSA9IERpc3BsYXkoYmF0dGxlc2hpcCwgcGxheWVyLCBvcHBvbmVudCwgY29udGFpbmVyKTtcbmJhdHRsZXNoaXAub25EcmF3ID0gKCkgPT4ge1xuICBkaXNwbGF5LmRyYXcoKTtcbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=