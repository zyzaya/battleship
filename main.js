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
  let opponentDisplay = (0,_DisplayBoard__WEBPACK_IMPORTED_MODULE_0__["default"])(container);
  let playerDisplay = (0,_DisplayBoard__WEBPACK_IMPORTED_MODULE_0__["default"])(container);

  let isAllShipsPlaced = function () {
    return Object.keys(_ShipNames__WEBPACK_IMPORTED_MODULE_1__["default"]).every(
      (name) => battleship.getShipInfo(name, true) !== undefined
    );
  };
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
    playerDisplay.drawShip(info.name, battleship.getShipInfo(info.name, true));
    if (isAllShipsPlaced()) start.disabled = false;
  };
  opponentDisplay.onCellClick = (e) => {
    let origin = opponentDisplay.cellFromPoint(
      e.x - e.offsetX,
      e.y - e.offsetY
    );
    player.setGuess(origin.x, origin.y);
  };

  let shipyard = (0,_Shipyard__WEBPACK_IMPORTED_MODULE_2__["default"])(container);
  shipyard.onShipDragStart = (e, name) => {
    let info = battleship.getShipInfo(name, true);
    let horizontal = info === undefined ? false : info.horizontal;
    e.dataTransfer.setData(
      'text',
      JSON.stringify({
        name: e.target.id,
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

  let startDiv = document.createElement('div');
  let start = document.createElement('button');
  start.classList.add('start');
  start.disabled = true;
  start.textContent = 'Start Game';
  start.onclick = () => {
    for (const name in _ShipNames__WEBPACK_IMPORTED_MODULE_1__["default"]) {
      let pos = opponent.getShipPosition(name);
      console.log(`${name}: ${JSON.stringify(pos)}`);
      battleship.placeShip(name, pos.x, pos.y, pos.horizontal, false);
      // opponentDisplay.drawShip(name, battleship.getShipInfo(name, false));
    }
    battleship.start();
  };
  startDiv.appendChild(start);
  container.appendChild(startDiv);

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
    // for each placed ship draw ship on player board
    // for each player guess draw x or o on opponent board
    // for each opponent guess draw x or o on player board
  };
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
function DisplayBoard(container) {
  let div = document.createElement('div');
  div.classList.add('board');

  let displayBoard = {};
  displayBoard.onCellDrop = {};
  displayBoard.onCellClick = {};
  displayBoard.cellFromPoint = function (x, y) {
    let cell = document.elementFromPoint(x, y);
    if (cell.classList.contains('cell') && div.contains(cell))
      return JSON.parse(cell.id);
    else return undefined;
  };

  displayBoard.drawShip = function (name, info) {
    if (info != undefined) {
      let ship = document.getElementById(name);
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
    let cell = document.getElementById(JSON.stringify({ x, y }));
    cell.textContent = isHit ? 'X' : '0';
  };

  let setupCells = function () {
    for (let y = 0; y < 11; y++) {
      for (let x = 0; x < 11; x++) {
        let cell = document.createElement('div');
        cell.id = JSON.stringify({ x: x - 1, y: y - 1 });
        cell.style.gridArea = `${y + 1} / ${x + 1} / ${y + 2} / ${x + 2}`;
        if (y === 0 && x > 0) {
          cell.textContent = String.fromCharCode(64 + x);
          cell.classList.add('labelCell');
        } else if (x === 0 && y > 0) {
          cell.textContent = y.toString();
          cell.classList.add('labelCell');
        } else if (x > 0 && y > 0) cell.classList.add('cell');

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


function Shipyard(container) {
  let shipyard = {};
  let div = document.createElement('div');
  div.classList.add('shipyard');
  shipyard.onShipClick = {};
  shipyard.onShipDragStart = {};

  for (const name in _ShipNames__WEBPACK_IMPORTED_MODULE_0__["default"]) {
    let ship = document.createElement('div');
    ship.classList.add(name);
    ship.id = name;
    ship.classList.add('ship');
    ship.classList.add('verticalShip');
    ship.style.gridArea = name;
    ship.draggable = true;
    ship.ondragstart = (e) => {
      if (shipyard.onShipDragStart instanceof Function)
        shipyard.onShipDragStart(e, name);
    };
    ship.onclick = (e) => {
      if (shipyard.onShipClick instanceof Function)
        shipyard.onShipClick(e, name);
    };
    ship.textContent = name;
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
    let i = Math.floor(Math.random() * (remainingGuesses.length + 1));
    let guess = remainingGuesses[i];
    guess.isHit = false;
    history.push(guess);
    remainingGuesses = remainingGuesses.slice(i);
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
// let opponent = new DisplayBoard(container);
// let board = Board(10);
// let player = new DisplayBoard(container, board);
// let shipyard = new ShipyardDisplay(container, board);
let player = (0,_Player__WEBPACK_IMPORTED_MODULE_2__["default"])();
let opponent = (0,_SimpleAI__WEBPACK_IMPORTED_MODULE_3__["default"])();
let battleship = (0,_Battleship__WEBPACK_IMPORTED_MODULE_0__["default"])(player, opponent);
let display = (0,_Display__WEBPACK_IMPORTED_MODULE_1__["default"])(battleship, player, opponent, container);
battleship.onDraw = () => {
  display.draw();
};

// let finish = false;
// let getGuess = async function (i) {
//   while (!finish) {
//     i = i + 1;
//     console.log(i);
//     await new Promise((resolve) => {
//       setTimeout(() => resolve(i), 1000);
//     });
//   }
//   return i;
// };

// let count = function (i) {
//   console.log(i);
//   if (!finish) setTimeout(count, 500, i + 1);
// };
// let start = document.getElementById('start');
// start.onclick = async function () {
//   let a = await getGuess(1);
//   console.log(`Finish: ${a}`);
// };
// let stop = document.getElementById('stop');
// stop.onclick = () => {
//   finish = true;
// };

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ047QUFDRjtBQUNJOztBQUVsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxtREFBTTtBQUNuQixlQUFlLHFEQUFRO0FBQ3ZCLGlCQUFpQix1REFBVTtBQUMzQixjQUFjLG9EQUFPO0FBQ3JCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsRUFBRTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9CYXR0bGVzaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvQm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9EaXNwbGF5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvRGlzcGxheUJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvUGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvU2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL1NoaXBOYW1lcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL1NoaXB5YXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvU2ltcGxlQUkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJvYXJkIGZyb20gJy4vQm9hcmQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCYXR0bGVzaGlwKHBsYXllcjEsIHBsYXllcjIpIHtcbiAgbGV0IG9iaiA9IHt9O1xuICBsZXQgc2l6ZSA9IDEwO1xuICBsZXQgcDFCb2FyZCA9IEJvYXJkKHNpemUpO1xuICBsZXQgcDJCb2FyZCA9IEJvYXJkKHNpemUpO1xuICBsZXQgaXNQMVR1cm4gPSB0cnVlO1xuICBvYmoub25EcmF3ID0ge307XG5cbiAgbGV0IGlzVmFsaWRHdWVzcyA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgcmV0dXJuIHggPj0gMCAmJiB4IDwgc2l6ZSAmJiB5ID49IDAgJiYgeSA8IHNpemU7XG4gIH07XG5cbiAgb2JqLnBsYWNlU2hpcCA9IGZ1bmN0aW9uIChuYW1lLCB4LCB5LCBob3Jpem9udGFsLCBpc1BsYXllcjEpIHtcbiAgICBpZiAoaXNQbGF5ZXIxICYmIHAxQm9hcmQuaXNWYWxpZFNoaXBQbGFjZW1lbnQobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCkpXG4gICAgICBwMUJvYXJkLnBsYWNlU2hpcChuYW1lLCB4LCB5LCBob3Jpem9udGFsKTtcbiAgICBlbHNlIGlmIChwMkJvYXJkLmlzVmFsaWRTaGlwUGxhY2VtZW50KG5hbWUsIHgsIHksIGhvcml6b250YWwpKVxuICAgICAgcDJCb2FyZC5wbGFjZVNoaXAobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCk7XG4gIH07XG5cbiAgb2JqLmdldFNoaXBJbmZvID0gZnVuY3Rpb24gKG5hbWUsIGlzUGxheWVyMSkge1xuICAgIHJldHVybiBpc1BsYXllcjEgPyBwMUJvYXJkLmdldFNoaXBJbmZvKG5hbWUpIDogcDJCb2FyZC5nZXRTaGlwSW5mbyhuYW1lKTtcbiAgfTtcblxuICBsZXQgbmV4dFR1cm4gPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IG9wcG9uZW50Qm9hcmQgPSBpc1AxVHVybiA/IHAyQm9hcmQgOiBwMUJvYXJkO1xuICAgIGxldCBjdXJyZW50UGxheWVyID0gaXNQMVR1cm4gPyBwbGF5ZXIxIDogcGxheWVyMjtcbiAgICBsZXQgZ3Vlc3MgPSBhd2FpdCBjdXJyZW50UGxheWVyLmdldEd1ZXNzKCk7XG4gICAgaWYgKCFpc1ZhbGlkR3Vlc3MoZ3Vlc3MueCwgZ3Vlc3MueSkpXG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcbiAgICAgICAgYFBsYXllciAke2lzUDFUdXJuID8gJzEnIDogJzInfSBndWVzcyBpcyBpbnZhbGlkLiAoJHtndWVzc30pYFxuICAgICAgKTtcblxuICAgIGxldCBpc0hpdCA9IG9wcG9uZW50Qm9hcmQuaGl0KGd1ZXNzLngsIGd1ZXNzLnkpO1xuICAgIGN1cnJlbnRQbGF5ZXIuc2V0RmVlZGJhY2soaXNIaXQpO1xuICAgIGlmIChvYmoub25EcmF3IGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgIG9iai5vbkRyYXcoKTtcbiAgICB9XG4gICAgaXNQMVR1cm4gPSAhaXNQMVR1cm47XG4gICAgbmV4dFR1cm4oKTtcbiAgfTtcblxuICBvYmouc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaXNQMVR1cm4gPSB0cnVlO1xuICAgIG5leHRUdXJuKCk7XG4gIH07XG4gIHJldHVybiBvYmo7XG59XG4iLCJpbXBvcnQgU2hpcCBmcm9tICcuL1NoaXAnO1xuaW1wb3J0IFNoaXBOYW1lcyBmcm9tICcuL1NoaXBOYW1lcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJvYXJkKHNpemUpIHtcbiAgbGV0IHNoaXBzID0ge307XG4gIHNoaXBzW1NoaXBOYW1lcy5DYXJyaWVyXSA9IFNoaXAoNSk7XG4gIHNoaXBzW1NoaXBOYW1lcy5CYXR0bGVzaGlwXSA9IFNoaXAoNCk7XG4gIHNoaXBzW1NoaXBOYW1lcy5EZXN0cm95ZXJdID0gU2hpcCgzKTtcbiAgc2hpcHNbU2hpcE5hbWVzLlN1Ym1hcmluZV0gPSBTaGlwKDMpO1xuICBzaGlwc1tTaGlwTmFtZXMuUGF0cm9sQm9hdF0gPSBTaGlwKDIpO1xuICBsZXQgcGxhY2VkU2hpcHMgPSBbXTtcbiAgbGV0IHZhbGlkYXRlU2hpcEluZm8gPSBmdW5jdGlvbiAobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCkge1xuICAgIGlmIChzaGlwc1tuYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvcjogbmFtZSBtdXN0IGJlIGEgdmFsaWQgc2hpcCBuYW1lJyk7XG4gICAgaWYgKHggPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcigneCBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB6ZXJvJyk7XG4gICAgaWYgKHkgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcigneSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB6ZXJvJyk7XG4gICAgaWYgKGhvcml6b250YWwgJiYgeCArIHNoaXBzW25hbWVdLmdldExlbmd0aCgpIC0gMSA+PSBzaXplKVxuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXG4gICAgICAgIGB4ICR7XG4gICAgICAgICAgeCArIHNoaXBzW25hbWVdLmdldExlbmd0aCgpIC0gMVxuICAgICAgICB9IG11c3QgYmUgbGVzcyB0aGFuIHRoZSBzaXplIG9mIHRoZSBib2FyZCAoJHtzaXplfSlgXG4gICAgICApO1xuICAgIGlmICghaG9yaXpvbnRhbCAmJiB5ICsgc2hpcHNbbmFtZV0uZ2V0TGVuZ3RoKCkgLSAxID49IHNpemUpXG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcbiAgICAgICAgYHkgKCR7XG4gICAgICAgICAgeSArIHNoaXBzW25hbWVdLmdldExlbmd0aCgpIC0gMVxuICAgICAgICB9KSBtdXN0IGJlIGxlc3MgdGhhbiB0aGUgc2l6ZSBvZiB0aGUgYm9hcmQgKCR7c2l6ZX0pYFxuICAgICAgKTtcbiAgfTtcblxuICBsZXQgaXNWYWxpZFNoaXBQbGFjZW1lbnQgPSBmdW5jdGlvbiAobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCkge1xuICAgIGlmIChzaGlwc1tuYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvcjogbmFtZSBtdXN0IGJlIGEgdmFsaWQgc2hpcCBuYW1lJyk7XG4gICAgbGV0IGxlZnQgPSB4O1xuICAgIGxldCB0b3AgPSB5O1xuICAgIGxldCByaWdodCA9IGhvcml6b250YWwgPyBsZWZ0ICsgc2hpcHNbbmFtZV0uZ2V0TGVuZ3RoKCkgLSAxIDogbGVmdDtcbiAgICBsZXQgYm90dG9tID0gaG9yaXpvbnRhbCA/IHRvcCA6IHRvcCArIHNoaXBzW25hbWVdLmdldExlbmd0aCgpIC0gMTtcbiAgICBpZiAobGVmdCA8IDAgfHwgcmlnaHQgPCAwIHx8IHJpZ2h0ID49IHNpemUgfHwgYm90dG9tID49IHNpemUpIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiAhcGxhY2VkU2hpcHMuc29tZSgodmFsKSA9PiB7XG4gICAgICBpZiAodmFsICE9PSBuYW1lKSB7XG4gICAgICAgIGxldCBsID0gc2hpcHNbdmFsXS5nZXRPcmlnaW4oKS54O1xuICAgICAgICBsZXQgdCA9IHNoaXBzW3ZhbF0uZ2V0T3JpZ2luKCkueTtcbiAgICAgICAgbGV0IHIgPSBzaGlwc1t2YWxdLmlzSG9yaXpvbnRhbCgpID8gbCArIHNoaXBzW3ZhbF0uZ2V0TGVuZ3RoKCkgLSAxIDogbDtcbiAgICAgICAgbGV0IGIgPSBzaGlwc1t2YWxdLmlzSG9yaXpvbnRhbCgpID8gdCA6IHQgKyBzaGlwc1t2YWxdLmdldExlbmd0aCgpIC0gMTtcbiAgICAgICAgLy8gc2hpcHMgY29sbGlkZVxuICAgICAgICBpZiAoXG4gICAgICAgICAgKChsZWZ0ID49IGwgJiYgbGVmdCA8PSByKSB8fCAocmlnaHQgPj0gbCAmJiByaWdodCA8PSByKSkgJiZcbiAgICAgICAgICAoKHRvcCA+PSB0ICYmIHRvcCA8PSBiKSB8fCAoYm90dG9tID49IHQgJiYgYm90dG9tIDw9IGIpKVxuICAgICAgICApIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGxldCBwbGFjZVNoaXAgPSBmdW5jdGlvbiAobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCkge1xuICAgIHZhbGlkYXRlU2hpcEluZm8obmFtZSwgeCwgeSwgaG9yaXpvbnRhbCk7XG4gICAgaWYgKCFpc1ZhbGlkU2hpcFBsYWNlbWVudChuYW1lLCB4LCB5LCBob3Jpem9udGFsKSkgcmV0dXJuIGZhbHNlO1xuICAgIHNoaXBzW25hbWVdLnNldE9yaWdpbih4LCB5KTtcbiAgICBzaGlwc1tuYW1lXS5zZXRIb3Jpem9udGFsKGhvcml6b250YWwpO1xuICAgIGlmICghcGxhY2VkU2hpcHMuaW5jbHVkZXMobmFtZSkpIHBsYWNlZFNoaXBzLnB1c2gobmFtZSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgbGV0IHJlbW92ZVNoaXAgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIGlmIChzaGlwc1tuYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvcjogbmFtZSBtdXN0IGJlIGEgdmFsaWQgc2hpcCBuYW1lJyk7XG4gICAgcGxhY2VkU2hpcHMgPSBwbGFjZWRTaGlwcy5maWx0ZXIoKHYpID0+IHYgIT09IG5hbWUpO1xuICAgIHNoaXBzW25hbWVdLnJlc2V0SGl0cygpO1xuICB9O1xuXG4gIGxldCBoaXQgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgIGZvciAoY29uc3QgbmFtZSBpbiBzaGlwcykge1xuICAgICAgaWYgKHBsYWNlZFNoaXBzLmluY2x1ZGVzKG5hbWUpICYmIHNoaXBzW25hbWVdLmhpdCh4LCB5KSkgcmV0dXJuIG5hbWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBsZXQgaXNTdW5rID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBpZiAoc2hpcHNbbmFtZV0gPT09IHVuZGVmaW5lZClcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3I6IG5hbWUgbXVzdCBiZSBhIHZhbGlkIHNoaXAgbmFtZScpO1xuICAgIHJldHVybiBzaGlwc1tuYW1lXS5pc1N1bmsoKTtcbiAgfTtcblxuICBsZXQgZ2V0U2hpcEluZm8gPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIGlmIChzaGlwc1tuYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvcjogbmFtZSBtdXN0IGJlIGEgdmFsaWQgc2hpcCBuYW1lJyk7XG4gICAgaWYgKCFwbGFjZWRTaGlwcy5pbmNsdWRlcyhuYW1lKSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICByZXR1cm4ge1xuICAgICAgb3JpZ2luOiBzaGlwc1tuYW1lXS5nZXRPcmlnaW4oKSxcbiAgICAgIGhvcml6b250YWw6IHNoaXBzW25hbWVdLmlzSG9yaXpvbnRhbCgpLFxuICAgICAgc3Vuazogc2hpcHNbbmFtZV0uaXNTdW5rKCksXG4gICAgICBsZW5ndGg6IHNoaXBzW25hbWVdLmdldExlbmd0aCgpLFxuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBwbGFjZVNoaXAsXG4gICAgcmVtb3ZlU2hpcCxcbiAgICBoaXQsXG4gICAgaXNTdW5rLFxuICAgIGdldFNoaXBJbmZvLFxuICAgIGlzVmFsaWRTaGlwUGxhY2VtZW50LFxuICB9O1xufVxuIiwiaW1wb3J0IERpc3BsYXlCb2FyZCBmcm9tICcuL0Rpc3BsYXlCb2FyZCc7XG5pbXBvcnQgU2hpcE5hbWVzIGZyb20gJy4vU2hpcE5hbWVzJztcbmltcG9ydCBTaGlweWFyZCBmcm9tICcuL1NoaXB5YXJkJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRGlzcGxheShiYXR0bGVzaGlwLCBwbGF5ZXIsIG9wcG9uZW50LCBjb250YWluZXIpIHtcbiAgbGV0IG9wcG9uZW50RGlzcGxheSA9IERpc3BsYXlCb2FyZChjb250YWluZXIpO1xuICBsZXQgcGxheWVyRGlzcGxheSA9IERpc3BsYXlCb2FyZChjb250YWluZXIpO1xuXG4gIGxldCBpc0FsbFNoaXBzUGxhY2VkID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhTaGlwTmFtZXMpLmV2ZXJ5KFxuICAgICAgKG5hbWUpID0+IGJhdHRsZXNoaXAuZ2V0U2hpcEluZm8obmFtZSwgdHJ1ZSkgIT09IHVuZGVmaW5lZFxuICAgICk7XG4gIH07XG4gIHBsYXllckRpc3BsYXkub25DZWxsRHJvcCA9IChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGxldCBpbmZvID0gSlNPTi5wYXJzZShlLmRhdGFUcmFuc2Zlci5nZXREYXRhKCd0ZXh0JykpO1xuICAgIGxldCBvcmlnaW4gPSBwbGF5ZXJEaXNwbGF5LmNlbGxGcm9tUG9pbnQoXG4gICAgICBlLnggLSBlLm9mZnNldFggLSBpbmZvLm9mZnNldFggKyAyNSxcbiAgICAgIGUueSAtIGUub2Zmc2V0WSAtIGluZm8ub2Zmc2V0WSArIDI1XG4gICAgKTtcbiAgICBpZiAob3JpZ2luICE9PSB1bmRlZmluZWQpXG4gICAgICBiYXR0bGVzaGlwLnBsYWNlU2hpcChcbiAgICAgICAgaW5mby5uYW1lLFxuICAgICAgICBvcmlnaW4ueCxcbiAgICAgICAgb3JpZ2luLnksXG4gICAgICAgIGluZm8uaG9yaXpvbnRhbCxcbiAgICAgICAgdHJ1ZVxuICAgICAgKTtcbiAgICBwbGF5ZXJEaXNwbGF5LmRyYXdTaGlwKGluZm8ubmFtZSwgYmF0dGxlc2hpcC5nZXRTaGlwSW5mbyhpbmZvLm5hbWUsIHRydWUpKTtcbiAgICBpZiAoaXNBbGxTaGlwc1BsYWNlZCgpKSBzdGFydC5kaXNhYmxlZCA9IGZhbHNlO1xuICB9O1xuICBvcHBvbmVudERpc3BsYXkub25DZWxsQ2xpY2sgPSAoZSkgPT4ge1xuICAgIGxldCBvcmlnaW4gPSBvcHBvbmVudERpc3BsYXkuY2VsbEZyb21Qb2ludChcbiAgICAgIGUueCAtIGUub2Zmc2V0WCxcbiAgICAgIGUueSAtIGUub2Zmc2V0WVxuICAgICk7XG4gICAgcGxheWVyLnNldEd1ZXNzKG9yaWdpbi54LCBvcmlnaW4ueSk7XG4gIH07XG5cbiAgbGV0IHNoaXB5YXJkID0gU2hpcHlhcmQoY29udGFpbmVyKTtcbiAgc2hpcHlhcmQub25TaGlwRHJhZ1N0YXJ0ID0gKGUsIG5hbWUpID0+IHtcbiAgICBsZXQgaW5mbyA9IGJhdHRsZXNoaXAuZ2V0U2hpcEluZm8obmFtZSwgdHJ1ZSk7XG4gICAgbGV0IGhvcml6b250YWwgPSBpbmZvID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGluZm8uaG9yaXpvbnRhbDtcbiAgICBlLmRhdGFUcmFuc2Zlci5zZXREYXRhKFxuICAgICAgJ3RleHQnLFxuICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBuYW1lOiBlLnRhcmdldC5pZCxcbiAgICAgICAgb2Zmc2V0WDogZS5vZmZzZXRYLFxuICAgICAgICBvZmZzZXRZOiBlLm9mZnNldFksXG4gICAgICAgIGhvcml6b250YWw6IGhvcml6b250YWwsXG4gICAgICB9KVxuICAgICk7XG4gIH07XG4gIHNoaXB5YXJkLm9uU2hpcENsaWNrID0gKGUsIG5hbWUpID0+IHtcbiAgICBsZXQgaW5mbyA9IGJhdHRsZXNoaXAuZ2V0U2hpcEluZm8obmFtZSwgdHJ1ZSk7XG4gICAgaWYgKGluZm8gPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgIGJhdHRsZXNoaXAucGxhY2VTaGlwKFxuICAgICAgbmFtZSxcbiAgICAgIGluZm8ub3JpZ2luLngsXG4gICAgICBpbmZvLm9yaWdpbi55LFxuICAgICAgIWluZm8uaG9yaXpvbnRhbCxcbiAgICAgIHRydWVcbiAgICApO1xuICAgIHBsYXllckRpc3BsYXkuZHJhd1NoaXAobmFtZSwgYmF0dGxlc2hpcC5nZXRTaGlwSW5mbyhuYW1lLCB0cnVlKSk7XG4gIH07XG5cbiAgbGV0IHN0YXJ0RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGxldCBzdGFydCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICBzdGFydC5jbGFzc0xpc3QuYWRkKCdzdGFydCcpO1xuICBzdGFydC5kaXNhYmxlZCA9IHRydWU7XG4gIHN0YXJ0LnRleHRDb250ZW50ID0gJ1N0YXJ0IEdhbWUnO1xuICBzdGFydC5vbmNsaWNrID0gKCkgPT4ge1xuICAgIGZvciAoY29uc3QgbmFtZSBpbiBTaGlwTmFtZXMpIHtcbiAgICAgIGxldCBwb3MgPSBvcHBvbmVudC5nZXRTaGlwUG9zaXRpb24obmFtZSk7XG4gICAgICBjb25zb2xlLmxvZyhgJHtuYW1lfTogJHtKU09OLnN0cmluZ2lmeShwb3MpfWApO1xuICAgICAgYmF0dGxlc2hpcC5wbGFjZVNoaXAobmFtZSwgcG9zLngsIHBvcy55LCBwb3MuaG9yaXpvbnRhbCwgZmFsc2UpO1xuICAgICAgLy8gb3Bwb25lbnREaXNwbGF5LmRyYXdTaGlwKG5hbWUsIGJhdHRsZXNoaXAuZ2V0U2hpcEluZm8obmFtZSwgZmFsc2UpKTtcbiAgICB9XG4gICAgYmF0dGxlc2hpcC5zdGFydCgpO1xuICB9O1xuICBzdGFydERpdi5hcHBlbmRDaGlsZChzdGFydCk7XG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChzdGFydERpdik7XG5cbiAgbGV0IGRyYXdTaGlwcyA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gU2hpcE5hbWVzKSB7XG4gICAgICBwbGF5ZXJEaXNwbGF5LmRyYXdTaGlwKG5hbWUsIGJhdHRsZXNoaXAuZ2V0U2hpcEluZm8obmFtZSwgdHJ1ZSkpO1xuICAgIH1cbiAgfTtcblxuICBsZXQgZHJhd0d1ZXNzZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcGxheWVyLmdldEhpc3RvcnkoKS5mb3JFYWNoKChlKSA9PiB7XG4gICAgICBvcHBvbmVudERpc3BsYXkuZHJhd0d1ZXNzKGUueCwgZS55LCBlLmlzSGl0KTtcbiAgICB9KTtcblxuICAgIG9wcG9uZW50LmdldEhpc3RvcnkoKS5mb3JFYWNoKChlKSA9PiB7XG4gICAgICBwbGF5ZXJEaXNwbGF5LmRyYXdHdWVzcyhlLngsIGUueSwgZS5pc0hpdCk7XG4gICAgfSk7XG4gIH07XG5cbiAgbGV0IGRyYXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgZHJhd1NoaXBzKCk7XG4gICAgZHJhd0d1ZXNzZXMoKTtcbiAgICAvLyBmb3IgZWFjaCBwbGFjZWQgc2hpcCBkcmF3IHNoaXAgb24gcGxheWVyIGJvYXJkXG4gICAgLy8gZm9yIGVhY2ggcGxheWVyIGd1ZXNzIGRyYXcgeCBvciBvIG9uIG9wcG9uZW50IGJvYXJkXG4gICAgLy8gZm9yIGVhY2ggb3Bwb25lbnQgZ3Vlc3MgZHJhdyB4IG9yIG8gb24gcGxheWVyIGJvYXJkXG4gIH07XG4gIHJldHVybiB7IGRyYXcgfTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIERpc3BsYXlCb2FyZChjb250YWluZXIpIHtcbiAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBkaXYuY2xhc3NMaXN0LmFkZCgnYm9hcmQnKTtcblxuICBsZXQgZGlzcGxheUJvYXJkID0ge307XG4gIGRpc3BsYXlCb2FyZC5vbkNlbGxEcm9wID0ge307XG4gIGRpc3BsYXlCb2FyZC5vbkNlbGxDbGljayA9IHt9O1xuICBkaXNwbGF5Qm9hcmQuY2VsbEZyb21Qb2ludCA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgbGV0IGNlbGwgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KHgsIHkpO1xuICAgIGlmIChjZWxsLmNsYXNzTGlzdC5jb250YWlucygnY2VsbCcpICYmIGRpdi5jb250YWlucyhjZWxsKSlcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKGNlbGwuaWQpO1xuICAgIGVsc2UgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfTtcblxuICBkaXNwbGF5Qm9hcmQuZHJhd1NoaXAgPSBmdW5jdGlvbiAobmFtZSwgaW5mbykge1xuICAgIGlmIChpbmZvICE9IHVuZGVmaW5lZCkge1xuICAgICAgbGV0IHNoaXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYW1lKTtcbiAgICAgIGxldCByaWdodCA9IGluZm8ub3JpZ2luLnggKyAzO1xuICAgICAgbGV0IGJvdHRvbSA9IGluZm8ub3JpZ2luLnkgKyAzO1xuICAgICAgaWYgKGluZm8uaG9yaXpvbnRhbCkge1xuICAgICAgICByaWdodCArPSBpbmZvLmxlbmd0aCAtIDE7XG4gICAgICAgIHNoaXAuY2xhc3NMaXN0LnJlbW92ZSgndmVydGljYWxTaGlwJyk7XG4gICAgICAgIHNoaXAuY2xhc3NMaXN0LmFkZCgnaG9yaXpvbnRhbFNoaXAnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJvdHRvbSArPSBpbmZvLmxlbmd0aCAtIDE7XG4gICAgICAgIHNoaXAuY2xhc3NMaXN0LnJlbW92ZSgnaG9yaXpvbnRhbFNoaXAnKTtcbiAgICAgICAgc2hpcC5jbGFzc0xpc3QuYWRkKCd2ZXJ0aWNhbFNoaXAnKTtcbiAgICAgIH1cbiAgICAgIHNoaXAuc3R5bGUuZ3JpZEFyZWEgPSBgXG4gICAgICAgICAgICAke2luZm8ub3JpZ2luLnkgKyAyfSAvXG4gICAgICAgICAgICAke2luZm8ub3JpZ2luLnggKyAyfSAvXG4gICAgICAgICAgICAke2JvdHRvbX0gL1xuICAgICAgICAgICAgJHtyaWdodH1gO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKHNoaXApO1xuICAgIH1cbiAgfTtcblxuICBkaXNwbGF5Qm9hcmQuZHJhd0d1ZXNzID0gZnVuY3Rpb24gKHgsIHksIGlzSGl0KSB7XG4gICAgbGV0IGNlbGwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChKU09OLnN0cmluZ2lmeSh7IHgsIHkgfSkpO1xuICAgIGNlbGwudGV4dENvbnRlbnQgPSBpc0hpdCA/ICdYJyA6ICcwJztcbiAgfTtcblxuICBsZXQgc2V0dXBDZWxscyA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8IDExOyB5KyspIHtcbiAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgMTE7IHgrKykge1xuICAgICAgICBsZXQgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBjZWxsLmlkID0gSlNPTi5zdHJpbmdpZnkoeyB4OiB4IC0gMSwgeTogeSAtIDEgfSk7XG4gICAgICAgIGNlbGwuc3R5bGUuZ3JpZEFyZWEgPSBgJHt5ICsgMX0gLyAke3ggKyAxfSAvICR7eSArIDJ9IC8gJHt4ICsgMn1gO1xuICAgICAgICBpZiAoeSA9PT0gMCAmJiB4ID4gMCkge1xuICAgICAgICAgIGNlbGwudGV4dENvbnRlbnQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDY0ICsgeCk7XG4gICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKCdsYWJlbENlbGwnKTtcbiAgICAgICAgfSBlbHNlIGlmICh4ID09PSAwICYmIHkgPiAwKSB7XG4gICAgICAgICAgY2VsbC50ZXh0Q29udGVudCA9IHkudG9TdHJpbmcoKTtcbiAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ2xhYmVsQ2VsbCcpO1xuICAgICAgICB9IGVsc2UgaWYgKHggPiAwICYmIHkgPiAwKSBjZWxsLmNsYXNzTGlzdC5hZGQoJ2NlbGwnKTtcblxuICAgICAgICBjZWxsLm9uZHJhZ292ZXIgPSAoZSkgPT4gZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjZWxsLm9uZHJvcCA9IChlKSA9PiB7XG4gICAgICAgICAgaWYgKGRpc3BsYXlCb2FyZC5vbkNlbGxEcm9wIGluc3RhbmNlb2YgRnVuY3Rpb24pXG4gICAgICAgICAgICBkaXNwbGF5Qm9hcmQub25DZWxsRHJvcChlLCB4ICsgMSwgeSArIDEpO1xuICAgICAgICB9O1xuICAgICAgICBjZWxsLm9uY2xpY2sgPSAoZSkgPT4ge1xuICAgICAgICAgIGlmIChkaXNwbGF5Qm9hcmQub25DZWxsQ2xpY2sgaW5zdGFuY2VvZiBGdW5jdGlvbilcbiAgICAgICAgICAgIGRpc3BsYXlCb2FyZC5vbkNlbGxDbGljayhlLCB4ICsgMSwgeSArIDEpO1xuICAgICAgICB9O1xuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoY2VsbCk7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkaXYpO1xuICB9O1xuXG4gIHNldHVwQ2VsbHMoKTtcbiAgcmV0dXJuIGRpc3BsYXlCb2FyZDtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFBsYXllcigpIHtcbiAgbGV0IGd1ZXNzID0gdW5kZWZpbmVkO1xuICBsZXQgaGlzdG9yeSA9IFtdO1xuXG4gIGxldCBnZXRHdWVzcyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICB3aGlsZSAoZ3Vlc3MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiByZXNvbHZlKCksIDUwKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBsZXQgcmV0ID0geyB4OiBndWVzcy54LCB5OiBndWVzcy55LCBpc0hpdDogZmFsc2UgfTtcbiAgICBoaXN0b3J5LnB1c2gocmV0KTtcbiAgICBndWVzcyA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmV0O1xuICB9O1xuXG4gIGxldCBzZXRHdWVzcyA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgZ3Vlc3MgPSB7IHg6IHgsIHk6IHkgfTtcbiAgfTtcblxuICBsZXQgc2V0RmVlZGJhY2sgPSBmdW5jdGlvbiAoaXNIaXQpIHtcbiAgICBoaXN0b3J5W2hpc3RvcnkubGVuZ3RoIC0gMV0uaXNIaXQgPSBpc0hpdDtcbiAgfTtcblxuICBsZXQgZ2V0SGlzdG9yeSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gWy4uLmhpc3RvcnldO1xuICB9O1xuXG4gIHJldHVybiB7IGdldEd1ZXNzLCBzZXRHdWVzcywgZ2V0SGlzdG9yeSwgc2V0RmVlZGJhY2sgfTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNoaXAobGVuZ3RoKSB7XG4gIGlmICghTnVtYmVyLmlzSW50ZWdlcihsZW5ndGgpKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2xlbmd0aCBtdXN0IGJlIGFuIGludGVnZXInKTtcbiAgZWxzZSBpZiAobGVuZ3RoIDwgMClcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignU2hpcCBsZW5ndGggY2Fubm90IGJlIGxlc3MgdGhhbiB6ZXJvJyk7XG4gIGxldCB4ID0gMDtcbiAgbGV0IHkgPSAwO1xuICBsZXQgaG9yaXpvbnRhbCA9IGZhbHNlO1xuICBsZXQgaGl0cyA9IFtdO1xuXG4gIGxldCBnZXRMZW5ndGggPSAoKSA9PiB7XG4gICAgcmV0dXJuIGxlbmd0aDtcbiAgfTtcblxuICBsZXQgc2V0T3JpZ2luID0gKG5ld1gsIG5ld1kpID0+IHtcbiAgICBpZiAoIU51bWJlci5pc0ludGVnZXIobmV3WCkpIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ggbXVzdCBiZSBhbiBpbnRlZ2VyJyk7XG4gICAgZWxzZSBpZiAoIU51bWJlci5pc0ludGVnZXIobmV3WSkpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd5IG11c3QgYmUgYW4gaW50ZWdlcicpO1xuXG4gICAgeCA9IG5ld1g7XG4gICAgeSA9IG5ld1k7XG4gIH07XG5cbiAgbGV0IGdldE9yaWdpbiA9ICgpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgeCxcbiAgICAgIHksXG4gICAgfTtcbiAgfTtcblxuICBsZXQgaXNIb3Jpem9udGFsID0gKCkgPT4ge1xuICAgIHJldHVybiBob3Jpem9udGFsO1xuICB9O1xuXG4gIGxldCBzZXRIb3Jpem9udGFsID0gKHZhbHVlKSA9PiB7XG4gICAgaG9yaXpvbnRhbCA9ICEhdmFsdWU7XG4gIH07XG5cbiAgbGV0IGhpdCA9ICh0YXJnZXRYLCB0YXJnZXRZKSA9PiB7XG4gICAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKHRhcmdldFgpKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndGFyZ2V0WCBtdXN0IGJlIGFuIGludGVnZXInKTtcbiAgICBlbHNlIGlmICghTnVtYmVyLmlzSW50ZWdlcih0YXJnZXRZKSlcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3RhcmdldFkgbXVzdCBiZSBhbiBpbnRlZ2VyJyk7XG5cbiAgICBsZXQgc3VjY2VzcyA9XG4gICAgICAoaG9yaXpvbnRhbCAmJiB5ID09PSB0YXJnZXRZICYmIHRhcmdldFggPj0geCAmJiB0YXJnZXRYIDwgeCArIGxlbmd0aCkgfHxcbiAgICAgICghaG9yaXpvbnRhbCAmJiB4ID09PSB0YXJnZXRYICYmIHRhcmdldFkgPj0geSAmJiB0YXJnZXRZIDwgeSArIGxlbmd0aCk7XG4gICAgaWYgKHN1Y2Nlc3MpIGhpdHMucHVzaCh7IHg6IHRhcmdldFgsIHk6IHRhcmdldFkgfSk7XG4gICAgcmV0dXJuIHN1Y2Nlc3M7XG4gIH07XG5cbiAgbGV0IGlzU3VuayA9ICgpID0+IHtcbiAgICBpZiAoaGl0cy5sZW5ndGggPT09IDApIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gaGl0cy5ldmVyeSgodikgPT4ge1xuICAgICAgaWYgKGhvcml6b250YWwpIHJldHVybiB2LnkgPT09IHkgJiYgdi54ID49IHggJiYgdi54IDwgeCArIGxlbmd0aDtcbiAgICAgIGVsc2UgcmV0dXJuIHYueCA9PT0geCAmJiB2LnkgPj0geSAmJiB2LnkgPCB5ICsgbGVuZ3RoO1xuICAgIH0pO1xuICB9O1xuXG4gIGxldCByZXNldEhpdHMgPSAoKSA9PiAoaGl0cy5sZW5ndGggPSAwKTtcbiAgcmV0dXJuIHtcbiAgICBnZXRMZW5ndGgsXG4gICAgZ2V0T3JpZ2luLFxuICAgIHNldE9yaWdpbixcbiAgICBpc0hvcml6b250YWwsXG4gICAgc2V0SG9yaXpvbnRhbCxcbiAgICBoaXQsXG4gICAgaXNTdW5rLFxuICAgIHJlc2V0SGl0cyxcbiAgfTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiBTaGlwTmFtZXMoKSB7XG4gIHJldHVybiB7XG4gICAgQ2FycmllcjogJ0NhcnJpZXInLFxuICAgIEJhdHRsZXNoaXA6ICdCYXR0bGVzaGlwJyxcbiAgICBEZXN0cm95ZXI6ICdEZXN0cm95ZXInLFxuICAgIFN1Ym1hcmluZTogJ1N1Ym1hcmluZScsXG4gICAgUGF0cm9sQm9hdDogJ1BhdHJvbEJvYXQnLFxuICB9O1xufSkoKTtcbiIsImltcG9ydCBTaGlwTmFtZXMgZnJvbSAnLi9TaGlwTmFtZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTaGlweWFyZChjb250YWluZXIpIHtcbiAgbGV0IHNoaXB5YXJkID0ge307XG4gIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGl2LmNsYXNzTGlzdC5hZGQoJ3NoaXB5YXJkJyk7XG4gIHNoaXB5YXJkLm9uU2hpcENsaWNrID0ge307XG4gIHNoaXB5YXJkLm9uU2hpcERyYWdTdGFydCA9IHt9O1xuXG4gIGZvciAoY29uc3QgbmFtZSBpbiBTaGlwTmFtZXMpIHtcbiAgICBsZXQgc2hpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHNoaXAuY2xhc3NMaXN0LmFkZChuYW1lKTtcbiAgICBzaGlwLmlkID0gbmFtZTtcbiAgICBzaGlwLmNsYXNzTGlzdC5hZGQoJ3NoaXAnKTtcbiAgICBzaGlwLmNsYXNzTGlzdC5hZGQoJ3ZlcnRpY2FsU2hpcCcpO1xuICAgIHNoaXAuc3R5bGUuZ3JpZEFyZWEgPSBuYW1lO1xuICAgIHNoaXAuZHJhZ2dhYmxlID0gdHJ1ZTtcbiAgICBzaGlwLm9uZHJhZ3N0YXJ0ID0gKGUpID0+IHtcbiAgICAgIGlmIChzaGlweWFyZC5vblNoaXBEcmFnU3RhcnQgaW5zdGFuY2VvZiBGdW5jdGlvbilcbiAgICAgICAgc2hpcHlhcmQub25TaGlwRHJhZ1N0YXJ0KGUsIG5hbWUpO1xuICAgIH07XG4gICAgc2hpcC5vbmNsaWNrID0gKGUpID0+IHtcbiAgICAgIGlmIChzaGlweWFyZC5vblNoaXBDbGljayBpbnN0YW5jZW9mIEZ1bmN0aW9uKVxuICAgICAgICBzaGlweWFyZC5vblNoaXBDbGljayhlLCBuYW1lKTtcbiAgICB9O1xuICAgIHNoaXAudGV4dENvbnRlbnQgPSBuYW1lO1xuICAgIGRpdi5hcHBlbmRDaGlsZChzaGlwKTtcbiAgfVxuICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgcmV0dXJuIHNoaXB5YXJkO1xufVxuIiwiaW1wb3J0IEJvYXJkIGZyb20gJy4vQm9hcmQnO1xuaW1wb3J0IFNoaXBOYW1lcyBmcm9tICcuL1NoaXBOYW1lcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNpbXBsZUFJKCkge1xuICBsZXQgc2l6ZSA9IDEwO1xuICBsZXQgcmVtYWluaW5nR3Vlc3NlcyA9IFtdO1xuICBsZXQgaGlzdG9yeSA9IFtdO1xuICBsZXQgc2hpcHMgPSB7fTtcblxuICBsZXQgZ2V0UmFuZG9tUG9zaXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IG1pbiA9IDA7XG4gICAgbGV0IG1heCA9IHNpemU7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW4sXG4gICAgICB5OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluLFxuICAgICAgaG9yaXpvbnRhbDogTWF0aC5yYW5kb20oKSA8IDAuNSxcbiAgICB9O1xuICB9O1xuXG4gIGxldCBzaHVmZmxlU2hpcFBvc2l0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgYm9hcmQgPSBCb2FyZChzaXplKTtcblxuICAgIGZvciAoY29uc3QgbmFtZSBpbiBTaGlwTmFtZXMpIHtcbiAgICAgIGxldCBwb3MgPSBnZXRSYW5kb21Qb3NpdGlvbigpO1xuICAgICAgd2hpbGUgKCFib2FyZC5pc1ZhbGlkU2hpcFBsYWNlbWVudChuYW1lLCBwb3MueCwgcG9zLnksIHBvcy5ob3Jpem9udGFsKSkge1xuICAgICAgICBwb3MgPSBnZXRSYW5kb21Qb3NpdGlvbigpO1xuICAgICAgfVxuICAgICAgYm9hcmQucGxhY2VTaGlwKG5hbWUsIHBvcy54LCBwb3MueSwgcG9zLmhvcml6b250YWwpO1xuICAgICAgc2hpcHNbbmFtZV0gPSBwb3M7XG4gICAgfVxuICB9O1xuXG4gIGxldCBnZXRTaGlwUG9zaXRpb24gPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHJldHVybiBzaGlwc1tuYW1lXTtcbiAgfTtcblxuICBsZXQgZ2V0R3Vlc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAocmVtYWluaW5nR3Vlc3Nlcy5sZW5ndGggKyAxKSk7XG4gICAgbGV0IGd1ZXNzID0gcmVtYWluaW5nR3Vlc3Nlc1tpXTtcbiAgICBndWVzcy5pc0hpdCA9IGZhbHNlO1xuICAgIGhpc3RvcnkucHVzaChndWVzcyk7XG4gICAgcmVtYWluaW5nR3Vlc3NlcyA9IHJlbWFpbmluZ0d1ZXNzZXMuc2xpY2UoaSk7XG4gICAgcmV0dXJuIGd1ZXNzO1xuICB9O1xuXG4gIGxldCBzZXRGZWVkYmFjayA9IGZ1bmN0aW9uIChpc0hpdCkge1xuICAgIGhpc3RvcnlbaGlzdG9yeS5sZW5ndGggLSAxXS5pc0hpdCA9IGlzSGl0O1xuICB9O1xuXG4gIGxldCBnZXRIaXN0b3J5ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBbLi4uaGlzdG9yeV07XG4gIH07XG5cbiAgbGV0IHJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIHNodWZmbGVTaGlwUG9zaXRpb25zKCk7XG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBzaXplOyB4KyspIHtcbiAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgc2l6ZTsgeSsrKSB7XG4gICAgICAgIHJlbWFpbmluZ0d1ZXNzZXMucHVzaCh7IHgsIHkgfSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHJlc2V0KCk7XG4gIHJldHVybiB7IGdldEd1ZXNzLCBnZXRIaXN0b3J5LCBnZXRTaGlwUG9zaXRpb24sIHJlc2V0LCBzZXRGZWVkYmFjayB9O1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgQmF0dGxlc2hpcCBmcm9tICcuL0JhdHRsZXNoaXAnO1xuaW1wb3J0IERpc3BsYXkgZnJvbSAnLi9EaXNwbGF5JztcbmltcG9ydCBQbGF5ZXIgZnJvbSAnLi9QbGF5ZXInO1xuaW1wb3J0IFNpbXBsZUFJIGZyb20gJy4vU2ltcGxlQUknO1xuXG5sZXQgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcicpO1xuLy8gbGV0IG9wcG9uZW50ID0gbmV3IERpc3BsYXlCb2FyZChjb250YWluZXIpO1xuLy8gbGV0IGJvYXJkID0gQm9hcmQoMTApO1xuLy8gbGV0IHBsYXllciA9IG5ldyBEaXNwbGF5Qm9hcmQoY29udGFpbmVyLCBib2FyZCk7XG4vLyBsZXQgc2hpcHlhcmQgPSBuZXcgU2hpcHlhcmREaXNwbGF5KGNvbnRhaW5lciwgYm9hcmQpO1xubGV0IHBsYXllciA9IFBsYXllcigpO1xubGV0IG9wcG9uZW50ID0gU2ltcGxlQUkoKTtcbmxldCBiYXR0bGVzaGlwID0gQmF0dGxlc2hpcChwbGF5ZXIsIG9wcG9uZW50KTtcbmxldCBkaXNwbGF5ID0gRGlzcGxheShiYXR0bGVzaGlwLCBwbGF5ZXIsIG9wcG9uZW50LCBjb250YWluZXIpO1xuYmF0dGxlc2hpcC5vbkRyYXcgPSAoKSA9PiB7XG4gIGRpc3BsYXkuZHJhdygpO1xufTtcblxuLy8gbGV0IGZpbmlzaCA9IGZhbHNlO1xuLy8gbGV0IGdldEd1ZXNzID0gYXN5bmMgZnVuY3Rpb24gKGkpIHtcbi8vICAgd2hpbGUgKCFmaW5pc2gpIHtcbi8vICAgICBpID0gaSArIDE7XG4vLyAgICAgY29uc29sZS5sb2coaSk7XG4vLyAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbi8vICAgICAgIHNldFRpbWVvdXQoKCkgPT4gcmVzb2x2ZShpKSwgMTAwMCk7XG4vLyAgICAgfSk7XG4vLyAgIH1cbi8vICAgcmV0dXJuIGk7XG4vLyB9O1xuXG4vLyBsZXQgY291bnQgPSBmdW5jdGlvbiAoaSkge1xuLy8gICBjb25zb2xlLmxvZyhpKTtcbi8vICAgaWYgKCFmaW5pc2gpIHNldFRpbWVvdXQoY291bnQsIDUwMCwgaSArIDEpO1xuLy8gfTtcbi8vIGxldCBzdGFydCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydCcpO1xuLy8gc3RhcnQub25jbGljayA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcbi8vICAgbGV0IGEgPSBhd2FpdCBnZXRHdWVzcygxKTtcbi8vICAgY29uc29sZS5sb2coYEZpbmlzaDogJHthfWApO1xuLy8gfTtcbi8vIGxldCBzdG9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0b3AnKTtcbi8vIHN0b3Aub25jbGljayA9ICgpID0+IHtcbi8vICAgZmluaXNoID0gdHJ1ZTtcbi8vIH07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=