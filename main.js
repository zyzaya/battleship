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
  let playerDisplay = (0,_DisplayBoard__WEBPACK_IMPORTED_MODULE_0__["default"])(container, 'player');
  let startDiv = document.createElement('div');
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
    start.classList.add('start');
    start.disabled = true;
    start.textContent = 'Start Game';
    start.onclick = () => {
      for (const name in _ShipNames__WEBPACK_IMPORTED_MODULE_1__["default"]) {
        let pos = opponent.getShipPosition(name);
        battleship.placeShip(name, pos.x, pos.y, pos.horizontal, false);
        opponentDisplay.drawShip(name, battleship.getShipInfo(name, false));
      }
      battleship.start();
    };
    startDiv.appendChild(start);
    container.appendChild(startDiv);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7OztBQ05zQztBQUNOO0FBQ0Y7QUFDSTs7QUFFbEM7QUFDQSxhQUFhLG1EQUFNO0FBQ25CLGVBQWUscURBQVE7QUFDdkIsaUJBQWlCLHVEQUFVO0FBQzNCLGNBQWMsb0RBQU87QUFDckI7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9CYXR0bGVzaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvQm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9EaXNwbGF5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvRGlzcGxheUJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvUGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvU2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL1NoaXBOYW1lcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL1NoaXB5YXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvU2ltcGxlQUkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJvYXJkIGZyb20gJy4vQm9hcmQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCYXR0bGVzaGlwKHBsYXllcjEsIHBsYXllcjIpIHtcbiAgbGV0IG9iaiA9IHt9O1xuICBsZXQgc2l6ZSA9IDEwO1xuICBsZXQgcDFCb2FyZCA9IEJvYXJkKHNpemUpO1xuICBsZXQgcDJCb2FyZCA9IEJvYXJkKHNpemUpO1xuICBsZXQgaXNQMVR1cm4gPSB0cnVlO1xuICBvYmoub25EcmF3ID0ge307XG5cbiAgbGV0IGlzVmFsaWRHdWVzcyA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgcmV0dXJuIHggPj0gMCAmJiB4IDwgc2l6ZSAmJiB5ID49IDAgJiYgeSA8IHNpemU7XG4gIH07XG5cbiAgb2JqLnBsYWNlU2hpcCA9IGZ1bmN0aW9uIChuYW1lLCB4LCB5LCBob3Jpem9udGFsLCBpc1BsYXllcjEpIHtcbiAgICBpZiAoaXNQbGF5ZXIxICYmIHAxQm9hcmQuaXNWYWxpZFNoaXBQbGFjZW1lbnQobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCkpXG4gICAgICBwMUJvYXJkLnBsYWNlU2hpcChuYW1lLCB4LCB5LCBob3Jpem9udGFsKTtcbiAgICBlbHNlIGlmIChwMkJvYXJkLmlzVmFsaWRTaGlwUGxhY2VtZW50KG5hbWUsIHgsIHksIGhvcml6b250YWwpKVxuICAgICAgcDJCb2FyZC5wbGFjZVNoaXAobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCk7XG4gIH07XG5cbiAgb2JqLmdldFNoaXBJbmZvID0gZnVuY3Rpb24gKG5hbWUsIGlzUGxheWVyMSkge1xuICAgIHJldHVybiBpc1BsYXllcjEgPyBwMUJvYXJkLmdldFNoaXBJbmZvKG5hbWUpIDogcDJCb2FyZC5nZXRTaGlwSW5mbyhuYW1lKTtcbiAgfTtcblxuICBsZXQgbmV4dFR1cm4gPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IG9wcG9uZW50Qm9hcmQgPSBpc1AxVHVybiA/IHAyQm9hcmQgOiBwMUJvYXJkO1xuICAgIGxldCBjdXJyZW50UGxheWVyID0gaXNQMVR1cm4gPyBwbGF5ZXIxIDogcGxheWVyMjtcbiAgICBsZXQgZ3Vlc3MgPSBhd2FpdCBjdXJyZW50UGxheWVyLmdldEd1ZXNzKCk7XG4gICAgaWYgKCFpc1ZhbGlkR3Vlc3MoZ3Vlc3MueCwgZ3Vlc3MueSkpXG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcbiAgICAgICAgYFBsYXllciAke2lzUDFUdXJuID8gJzEnIDogJzInfSBndWVzcyBpcyBpbnZhbGlkLiAoJHtndWVzc30pYFxuICAgICAgKTtcblxuICAgIGxldCBpc0hpdCA9IG9wcG9uZW50Qm9hcmQuaGl0KGd1ZXNzLngsIGd1ZXNzLnkpO1xuICAgIGN1cnJlbnRQbGF5ZXIuc2V0RmVlZGJhY2soaXNIaXQpO1xuICAgIGlmIChvYmoub25EcmF3IGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgIG9iai5vbkRyYXcoKTtcbiAgICB9XG4gICAgaXNQMVR1cm4gPSAhaXNQMVR1cm47XG4gICAgbmV4dFR1cm4oKTtcbiAgfTtcblxuICBvYmouc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaXNQMVR1cm4gPSB0cnVlO1xuICAgIG5leHRUdXJuKCk7XG4gIH07XG4gIHJldHVybiBvYmo7XG59XG4iLCJpbXBvcnQgU2hpcCBmcm9tICcuL1NoaXAnO1xuaW1wb3J0IFNoaXBOYW1lcyBmcm9tICcuL1NoaXBOYW1lcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJvYXJkKHNpemUpIHtcbiAgbGV0IHNoaXBzID0ge307XG4gIHNoaXBzW1NoaXBOYW1lcy5DYXJyaWVyXSA9IFNoaXAoNSk7XG4gIHNoaXBzW1NoaXBOYW1lcy5CYXR0bGVzaGlwXSA9IFNoaXAoNCk7XG4gIHNoaXBzW1NoaXBOYW1lcy5EZXN0cm95ZXJdID0gU2hpcCgzKTtcbiAgc2hpcHNbU2hpcE5hbWVzLlN1Ym1hcmluZV0gPSBTaGlwKDMpO1xuICBzaGlwc1tTaGlwTmFtZXMuUGF0cm9sQm9hdF0gPSBTaGlwKDIpO1xuICBsZXQgcGxhY2VkU2hpcHMgPSBbXTtcbiAgbGV0IHZhbGlkYXRlU2hpcEluZm8gPSBmdW5jdGlvbiAobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCkge1xuICAgIGlmIChzaGlwc1tuYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvcjogbmFtZSBtdXN0IGJlIGEgdmFsaWQgc2hpcCBuYW1lJyk7XG4gICAgaWYgKHggPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcigneCBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB6ZXJvJyk7XG4gICAgaWYgKHkgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcigneSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB6ZXJvJyk7XG4gICAgaWYgKGhvcml6b250YWwgJiYgeCArIHNoaXBzW25hbWVdLmdldExlbmd0aCgpIC0gMSA+PSBzaXplKVxuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXG4gICAgICAgIGB4ICR7XG4gICAgICAgICAgeCArIHNoaXBzW25hbWVdLmdldExlbmd0aCgpIC0gMVxuICAgICAgICB9IG11c3QgYmUgbGVzcyB0aGFuIHRoZSBzaXplIG9mIHRoZSBib2FyZCAoJHtzaXplfSlgXG4gICAgICApO1xuICAgIGlmICghaG9yaXpvbnRhbCAmJiB5ICsgc2hpcHNbbmFtZV0uZ2V0TGVuZ3RoKCkgLSAxID49IHNpemUpXG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcbiAgICAgICAgYHkgKCR7XG4gICAgICAgICAgeSArIHNoaXBzW25hbWVdLmdldExlbmd0aCgpIC0gMVxuICAgICAgICB9KSBtdXN0IGJlIGxlc3MgdGhhbiB0aGUgc2l6ZSBvZiB0aGUgYm9hcmQgKCR7c2l6ZX0pYFxuICAgICAgKTtcbiAgfTtcblxuICBsZXQgaXNWYWxpZFNoaXBQbGFjZW1lbnQgPSBmdW5jdGlvbiAobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCkge1xuICAgIGlmIChzaGlwc1tuYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvcjogbmFtZSBtdXN0IGJlIGEgdmFsaWQgc2hpcCBuYW1lJyk7XG4gICAgbGV0IGxlZnQgPSB4O1xuICAgIGxldCB0b3AgPSB5O1xuICAgIGxldCByaWdodCA9IGhvcml6b250YWwgPyBsZWZ0ICsgc2hpcHNbbmFtZV0uZ2V0TGVuZ3RoKCkgLSAxIDogbGVmdDtcbiAgICBsZXQgYm90dG9tID0gaG9yaXpvbnRhbCA/IHRvcCA6IHRvcCArIHNoaXBzW25hbWVdLmdldExlbmd0aCgpIC0gMTtcbiAgICBpZiAobGVmdCA8IDAgfHwgcmlnaHQgPCAwIHx8IHJpZ2h0ID49IHNpemUgfHwgYm90dG9tID49IHNpemUpIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiAhcGxhY2VkU2hpcHMuc29tZSgodmFsKSA9PiB7XG4gICAgICBpZiAodmFsICE9PSBuYW1lKSB7XG4gICAgICAgIGxldCBsID0gc2hpcHNbdmFsXS5nZXRPcmlnaW4oKS54O1xuICAgICAgICBsZXQgdCA9IHNoaXBzW3ZhbF0uZ2V0T3JpZ2luKCkueTtcbiAgICAgICAgbGV0IHIgPSBzaGlwc1t2YWxdLmlzSG9yaXpvbnRhbCgpID8gbCArIHNoaXBzW3ZhbF0uZ2V0TGVuZ3RoKCkgLSAxIDogbDtcbiAgICAgICAgbGV0IGIgPSBzaGlwc1t2YWxdLmlzSG9yaXpvbnRhbCgpID8gdCA6IHQgKyBzaGlwc1t2YWxdLmdldExlbmd0aCgpIC0gMTtcbiAgICAgICAgLy8gc2hpcHMgY29sbGlkZVxuICAgICAgICBpZiAoXG4gICAgICAgICAgKChsZWZ0ID49IGwgJiYgbGVmdCA8PSByKSB8fCAocmlnaHQgPj0gbCAmJiByaWdodCA8PSByKSkgJiZcbiAgICAgICAgICAoKHRvcCA+PSB0ICYmIHRvcCA8PSBiKSB8fCAoYm90dG9tID49IHQgJiYgYm90dG9tIDw9IGIpKVxuICAgICAgICApIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGxldCBwbGFjZVNoaXAgPSBmdW5jdGlvbiAobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCkge1xuICAgIHZhbGlkYXRlU2hpcEluZm8obmFtZSwgeCwgeSwgaG9yaXpvbnRhbCk7XG4gICAgaWYgKCFpc1ZhbGlkU2hpcFBsYWNlbWVudChuYW1lLCB4LCB5LCBob3Jpem9udGFsKSkgcmV0dXJuIGZhbHNlO1xuICAgIHNoaXBzW25hbWVdLnNldE9yaWdpbih4LCB5KTtcbiAgICBzaGlwc1tuYW1lXS5zZXRIb3Jpem9udGFsKGhvcml6b250YWwpO1xuICAgIGlmICghcGxhY2VkU2hpcHMuaW5jbHVkZXMobmFtZSkpIHBsYWNlZFNoaXBzLnB1c2gobmFtZSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgbGV0IHJlbW92ZVNoaXAgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIGlmIChzaGlwc1tuYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvcjogbmFtZSBtdXN0IGJlIGEgdmFsaWQgc2hpcCBuYW1lJyk7XG4gICAgcGxhY2VkU2hpcHMgPSBwbGFjZWRTaGlwcy5maWx0ZXIoKHYpID0+IHYgIT09IG5hbWUpO1xuICAgIHNoaXBzW25hbWVdLnJlc2V0SGl0cygpO1xuICB9O1xuXG4gIGxldCBoaXQgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgIGZvciAoY29uc3QgbmFtZSBpbiBzaGlwcykge1xuICAgICAgaWYgKHBsYWNlZFNoaXBzLmluY2x1ZGVzKG5hbWUpICYmIHNoaXBzW25hbWVdLmhpdCh4LCB5KSkgcmV0dXJuIG5hbWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBsZXQgaXNTdW5rID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBpZiAoc2hpcHNbbmFtZV0gPT09IHVuZGVmaW5lZClcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3I6IG5hbWUgbXVzdCBiZSBhIHZhbGlkIHNoaXAgbmFtZScpO1xuICAgIHJldHVybiBzaGlwc1tuYW1lXS5pc1N1bmsoKTtcbiAgfTtcblxuICBsZXQgZ2V0U2hpcEluZm8gPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIGlmIChzaGlwc1tuYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvcjogbmFtZSBtdXN0IGJlIGEgdmFsaWQgc2hpcCBuYW1lJyk7XG4gICAgaWYgKCFwbGFjZWRTaGlwcy5pbmNsdWRlcyhuYW1lKSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICByZXR1cm4ge1xuICAgICAgb3JpZ2luOiBzaGlwc1tuYW1lXS5nZXRPcmlnaW4oKSxcbiAgICAgIGhvcml6b250YWw6IHNoaXBzW25hbWVdLmlzSG9yaXpvbnRhbCgpLFxuICAgICAgc3Vuazogc2hpcHNbbmFtZV0uaXNTdW5rKCksXG4gICAgICBsZW5ndGg6IHNoaXBzW25hbWVdLmdldExlbmd0aCgpLFxuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBwbGFjZVNoaXAsXG4gICAgcmVtb3ZlU2hpcCxcbiAgICBoaXQsXG4gICAgaXNTdW5rLFxuICAgIGdldFNoaXBJbmZvLFxuICAgIGlzVmFsaWRTaGlwUGxhY2VtZW50LFxuICB9O1xufVxuIiwiaW1wb3J0IERpc3BsYXlCb2FyZCBmcm9tICcuL0Rpc3BsYXlCb2FyZCc7XG5pbXBvcnQgU2hpcE5hbWVzIGZyb20gJy4vU2hpcE5hbWVzJztcbmltcG9ydCBTaGlweWFyZCBmcm9tICcuL1NoaXB5YXJkJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRGlzcGxheShiYXR0bGVzaGlwLCBwbGF5ZXIsIG9wcG9uZW50LCBjb250YWluZXIpIHtcbiAgbGV0IG9wcG9uZW50RGlzcGxheSA9IERpc3BsYXlCb2FyZChjb250YWluZXIsICdvcHBvbmVudCcpO1xuICBsZXQgcGxheWVyRGlzcGxheSA9IERpc3BsYXlCb2FyZChjb250YWluZXIsICdwbGF5ZXInKTtcbiAgbGV0IHN0YXJ0RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGxldCBzdGFydCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuXG4gIGxldCBpc0FsbFNoaXBzUGxhY2VkID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhTaGlwTmFtZXMpLmV2ZXJ5KFxuICAgICAgKG5hbWUpID0+IGJhdHRsZXNoaXAuZ2V0U2hpcEluZm8obmFtZSwgdHJ1ZSkgIT09IHVuZGVmaW5lZFxuICAgICk7XG4gIH07XG5cbiAgbGV0IHNldHVwU2hpcFBsYWNlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICBwbGF5ZXJEaXNwbGF5Lm9uQ2VsbERyb3AgPSAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgbGV0IGluZm8gPSBKU09OLnBhcnNlKGUuZGF0YVRyYW5zZmVyLmdldERhdGEoJ3RleHQnKSk7XG4gICAgICBsZXQgb3JpZ2luID0gcGxheWVyRGlzcGxheS5jZWxsRnJvbVBvaW50KFxuICAgICAgICBlLnggLSBlLm9mZnNldFggLSBpbmZvLm9mZnNldFggKyAyNSxcbiAgICAgICAgZS55IC0gZS5vZmZzZXRZIC0gaW5mby5vZmZzZXRZICsgMjVcbiAgICAgICk7XG4gICAgICBpZiAob3JpZ2luICE9PSB1bmRlZmluZWQpXG4gICAgICAgIGJhdHRsZXNoaXAucGxhY2VTaGlwKFxuICAgICAgICAgIGluZm8ubmFtZSxcbiAgICAgICAgICBvcmlnaW4ueCxcbiAgICAgICAgICBvcmlnaW4ueSxcbiAgICAgICAgICBpbmZvLmhvcml6b250YWwsXG4gICAgICAgICAgdHJ1ZVxuICAgICAgICApO1xuICAgICAgcGxheWVyRGlzcGxheS5kcmF3U2hpcChcbiAgICAgICAgaW5mby5uYW1lLFxuICAgICAgICBiYXR0bGVzaGlwLmdldFNoaXBJbmZvKGluZm8ubmFtZSwgdHJ1ZSlcbiAgICAgICk7XG4gICAgICBpZiAoaXNBbGxTaGlwc1BsYWNlZCgpKSBzdGFydC5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIH07XG4gIH07XG4gIGxldCBzZXR1cEd1ZXNzaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIG9wcG9uZW50RGlzcGxheS5vbkNlbGxDbGljayA9IChlKSA9PiB7XG4gICAgICBsZXQgb3JpZ2luID0gb3Bwb25lbnREaXNwbGF5LmNlbGxGcm9tUG9pbnQoXG4gICAgICAgIGUueCAtIGUub2Zmc2V0WCxcbiAgICAgICAgZS55IC0gZS5vZmZzZXRZXG4gICAgICApO1xuICAgICAgcGxheWVyLnNldEd1ZXNzKG9yaWdpbi54LCBvcmlnaW4ueSk7XG4gICAgfTtcbiAgfTtcblxuICBsZXQgc2V0dXBTaGlweWFyZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgc2hpcHlhcmQgPSBTaGlweWFyZChjb250YWluZXIsICdwbGF5ZXInKTtcbiAgICBzaGlweWFyZC5vblNoaXBEcmFnU3RhcnQgPSAoZSwgbmFtZSkgPT4ge1xuICAgICAgbGV0IGluZm8gPSBiYXR0bGVzaGlwLmdldFNoaXBJbmZvKG5hbWUsIHRydWUpO1xuICAgICAgbGV0IGhvcml6b250YWwgPSBpbmZvID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGluZm8uaG9yaXpvbnRhbDtcbiAgICAgIGUuZGF0YVRyYW5zZmVyLnNldERhdGEoXG4gICAgICAgICd0ZXh0JyxcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgb2Zmc2V0WDogZS5vZmZzZXRYLFxuICAgICAgICAgIG9mZnNldFk6IGUub2Zmc2V0WSxcbiAgICAgICAgICBob3Jpem9udGFsOiBob3Jpem9udGFsLFxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9O1xuICAgIHNoaXB5YXJkLm9uU2hpcENsaWNrID0gKGUsIG5hbWUpID0+IHtcbiAgICAgIGxldCBpbmZvID0gYmF0dGxlc2hpcC5nZXRTaGlwSW5mbyhuYW1lLCB0cnVlKTtcbiAgICAgIGlmIChpbmZvID09PSB1bmRlZmluZWQpIHJldHVybjtcbiAgICAgIGJhdHRsZXNoaXAucGxhY2VTaGlwKFxuICAgICAgICBuYW1lLFxuICAgICAgICBpbmZvLm9yaWdpbi54LFxuICAgICAgICBpbmZvLm9yaWdpbi55LFxuICAgICAgICAhaW5mby5ob3Jpem9udGFsLFxuICAgICAgICB0cnVlXG4gICAgICApO1xuICAgICAgcGxheWVyRGlzcGxheS5kcmF3U2hpcChuYW1lLCBiYXR0bGVzaGlwLmdldFNoaXBJbmZvKG5hbWUsIHRydWUpKTtcbiAgICB9O1xuICB9O1xuXG4gIGxldCBzZXR1cFN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgIHN0YXJ0LmNsYXNzTGlzdC5hZGQoJ3N0YXJ0Jyk7XG4gICAgc3RhcnQuZGlzYWJsZWQgPSB0cnVlO1xuICAgIHN0YXJ0LnRleHRDb250ZW50ID0gJ1N0YXJ0IEdhbWUnO1xuICAgIHN0YXJ0Lm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IG5hbWUgaW4gU2hpcE5hbWVzKSB7XG4gICAgICAgIGxldCBwb3MgPSBvcHBvbmVudC5nZXRTaGlwUG9zaXRpb24obmFtZSk7XG4gICAgICAgIGJhdHRsZXNoaXAucGxhY2VTaGlwKG5hbWUsIHBvcy54LCBwb3MueSwgcG9zLmhvcml6b250YWwsIGZhbHNlKTtcbiAgICAgICAgb3Bwb25lbnREaXNwbGF5LmRyYXdTaGlwKG5hbWUsIGJhdHRsZXNoaXAuZ2V0U2hpcEluZm8obmFtZSwgZmFsc2UpKTtcbiAgICAgIH1cbiAgICAgIGJhdHRsZXNoaXAuc3RhcnQoKTtcbiAgICB9O1xuICAgIHN0YXJ0RGl2LmFwcGVuZENoaWxkKHN0YXJ0KTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoc3RhcnREaXYpO1xuICB9O1xuXG4gIGxldCBkcmF3U2hpcHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgZm9yIChjb25zdCBuYW1lIGluIFNoaXBOYW1lcykge1xuICAgICAgcGxheWVyRGlzcGxheS5kcmF3U2hpcChuYW1lLCBiYXR0bGVzaGlwLmdldFNoaXBJbmZvKG5hbWUsIHRydWUpKTtcbiAgICB9XG4gIH07XG5cbiAgbGV0IGRyYXdHdWVzc2VzID0gZnVuY3Rpb24gKCkge1xuICAgIHBsYXllci5nZXRIaXN0b3J5KCkuZm9yRWFjaCgoZSkgPT4ge1xuICAgICAgb3Bwb25lbnREaXNwbGF5LmRyYXdHdWVzcyhlLngsIGUueSwgZS5pc0hpdCk7XG4gICAgfSk7XG5cbiAgICBvcHBvbmVudC5nZXRIaXN0b3J5KCkuZm9yRWFjaCgoZSkgPT4ge1xuICAgICAgcGxheWVyRGlzcGxheS5kcmF3R3Vlc3MoZS54LCBlLnksIGUuaXNIaXQpO1xuICAgIH0pO1xuICB9O1xuXG4gIGxldCBkcmF3ID0gZnVuY3Rpb24gKCkge1xuICAgIGRyYXdTaGlwcygpO1xuICAgIGRyYXdHdWVzc2VzKCk7XG4gIH07XG5cbiAgbGV0IHNldHVwID0gZnVuY3Rpb24gKCkge1xuICAgIHNldHVwU2hpcFBsYWNlbWVudCgpO1xuICAgIHNldHVwR3Vlc3NpbmcoKTtcbiAgICBzZXR1cFNoaXB5YXJkKCk7XG4gICAgU2hpcHlhcmQoY29udGFpbmVyLCAnb3Bwb25lbnQnKTtcbiAgICBzZXR1cFN0YXJ0KCk7XG4gIH07XG5cbiAgc2V0dXAoKTtcbiAgcmV0dXJuIHsgZHJhdyB9O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRGlzcGxheUJvYXJkKGNvbnRhaW5lciwgbmFtZSkge1xuICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdi5jbGFzc0xpc3QuYWRkKCdib2FyZCcpO1xuICBsZXQgaW1hZ2VEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgaW1hZ2VEaXYuY2xhc3NMaXN0LmFkZCgnZ3JpZCcpO1xuICBkaXYuYXBwZW5kQ2hpbGQoaW1hZ2VEaXYpO1xuXG4gIGxldCBkaXNwbGF5Qm9hcmQgPSB7fTtcbiAgZGlzcGxheUJvYXJkLm9uQ2VsbERyb3AgPSB7fTtcbiAgZGlzcGxheUJvYXJkLm9uQ2VsbENsaWNrID0ge307XG4gIGRpc3BsYXlCb2FyZC5jZWxsRnJvbVBvaW50ID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICBsZXQgY2VsbCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoeCwgeSk7XG4gICAgaWYgKGNlbGwuY2xhc3NMaXN0LmNvbnRhaW5zKCdjZWxsJykgJiYgZGl2LmNvbnRhaW5zKGNlbGwpKVxuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoY2VsbC5pZCk7XG4gICAgZWxzZSByZXR1cm4gdW5kZWZpbmVkO1xuICB9O1xuXG4gIGRpc3BsYXlCb2FyZC5kcmF3U2hpcCA9IGZ1bmN0aW9uIChzaGlwTmFtZSwgaW5mbykge1xuICAgIGlmIChpbmZvICE9IHVuZGVmaW5lZCkge1xuICAgICAgbGV0IHNoaXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYW1lICsgc2hpcE5hbWUpO1xuICAgICAgbGV0IHJpZ2h0ID0gaW5mby5vcmlnaW4ueCArIDM7XG4gICAgICBsZXQgYm90dG9tID0gaW5mby5vcmlnaW4ueSArIDM7XG4gICAgICBpZiAoaW5mby5ob3Jpem9udGFsKSB7XG4gICAgICAgIHJpZ2h0ICs9IGluZm8ubGVuZ3RoIC0gMTtcbiAgICAgICAgc2hpcC5jbGFzc0xpc3QucmVtb3ZlKCd2ZXJ0aWNhbFNoaXAnKTtcbiAgICAgICAgc2hpcC5jbGFzc0xpc3QuYWRkKCdob3Jpem9udGFsU2hpcCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYm90dG9tICs9IGluZm8ubGVuZ3RoIC0gMTtcbiAgICAgICAgc2hpcC5jbGFzc0xpc3QucmVtb3ZlKCdob3Jpem9udGFsU2hpcCcpO1xuICAgICAgICBzaGlwLmNsYXNzTGlzdC5hZGQoJ3ZlcnRpY2FsU2hpcCcpO1xuICAgICAgfVxuICAgICAgc2hpcC5zdHlsZS5ncmlkQXJlYSA9IGBcbiAgICAgICAgICAgICR7aW5mby5vcmlnaW4ueSArIDJ9IC9cbiAgICAgICAgICAgICR7aW5mby5vcmlnaW4ueCArIDJ9IC9cbiAgICAgICAgICAgICR7Ym90dG9tfSAvXG4gICAgICAgICAgICAke3JpZ2h0fWA7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoc2hpcCk7XG4gICAgfVxuICB9O1xuXG4gIGRpc3BsYXlCb2FyZC5kcmF3R3Vlc3MgPSBmdW5jdGlvbiAoeCwgeSwgaXNIaXQpIHtcbiAgICBsZXQgY2VsbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEpTT04uc3RyaW5naWZ5KHsgbmFtZSwgeCwgeSB9KSk7XG4gICAgY2VsbC50ZXh0Q29udGVudCA9IGlzSGl0ID8gJ1gnIDogJzAnO1xuICB9O1xuXG4gIGxldCBzZXR1cENlbGxzID0gZnVuY3Rpb24gKCkge1xuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgMTE7IHkrKykge1xuICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCAxMTsgeCsrKSB7XG4gICAgICAgIGxldCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGNlbGwuaWQgPSBKU09OLnN0cmluZ2lmeSh7IG5hbWUsIHg6IHggLSAxLCB5OiB5IC0gMSB9KTtcbiAgICAgICAgY2VsbC5zdHlsZS5ncmlkQXJlYSA9IGAke3kgKyAxfSAvICR7eCArIDF9IC8gJHt5ICsgMn0gLyAke3ggKyAyfWA7XG4gICAgICAgIGlmICh5ID09PSAwICYmIHggPiAwKSB7XG4gICAgICAgICAgY2VsbC50ZXh0Q29udGVudCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoNjQgKyB4KTtcbiAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ2xhYmVsQ2VsbCcpO1xuICAgICAgICB9IGVsc2UgaWYgKHggPT09IDAgJiYgeSA+IDApIHtcbiAgICAgICAgICBjZWxsLnRleHRDb250ZW50ID0geS50b1N0cmluZygpO1xuICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnbGFiZWxDZWxsJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoeCA+IDAgJiYgeSA+IDApIGNlbGwuY2xhc3NMaXN0LmFkZCgnY2VsbCcpO1xuXG4gICAgICAgIGNlbGwub25kcmFnb3ZlciA9IChlKSA9PiBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNlbGwub25kcm9wID0gKGUpID0+IHtcbiAgICAgICAgICBpZiAoZGlzcGxheUJvYXJkLm9uQ2VsbERyb3AgaW5zdGFuY2VvZiBGdW5jdGlvbilcbiAgICAgICAgICAgIGRpc3BsYXlCb2FyZC5vbkNlbGxEcm9wKGUsIHggKyAxLCB5ICsgMSk7XG4gICAgICAgIH07XG4gICAgICAgIGNlbGwub25jbGljayA9IChlKSA9PiB7XG4gICAgICAgICAgaWYgKGRpc3BsYXlCb2FyZC5vbkNlbGxDbGljayBpbnN0YW5jZW9mIEZ1bmN0aW9uKVxuICAgICAgICAgICAgZGlzcGxheUJvYXJkLm9uQ2VsbENsaWNrKGUsIHggKyAxLCB5ICsgMSk7XG4gICAgICAgIH07XG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChjZWxsKTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRpdik7XG4gIH07XG5cbiAgc2V0dXBDZWxscygpO1xuICByZXR1cm4gZGlzcGxheUJvYXJkO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUGxheWVyKCkge1xuICBsZXQgZ3Vlc3MgPSB1bmRlZmluZWQ7XG4gIGxldCBoaXN0b3J5ID0gW107XG5cbiAgbGV0IGdldEd1ZXNzID0gYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgIHdoaWxlIChndWVzcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHJlc29sdmUoKSwgNTApO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGxldCByZXQgPSB7IHg6IGd1ZXNzLngsIHk6IGd1ZXNzLnksIGlzSGl0OiBmYWxzZSB9O1xuICAgIGhpc3RvcnkucHVzaChyZXQpO1xuICAgIGd1ZXNzID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiByZXQ7XG4gIH07XG5cbiAgbGV0IHNldEd1ZXNzID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICBndWVzcyA9IHsgeDogeCwgeTogeSB9O1xuICB9O1xuXG4gIGxldCBzZXRGZWVkYmFjayA9IGZ1bmN0aW9uIChpc0hpdCkge1xuICAgIGhpc3RvcnlbaGlzdG9yeS5sZW5ndGggLSAxXS5pc0hpdCA9IGlzSGl0O1xuICB9O1xuXG4gIGxldCBnZXRIaXN0b3J5ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBbLi4uaGlzdG9yeV07XG4gIH07XG5cbiAgcmV0dXJuIHsgZ2V0R3Vlc3MsIHNldEd1ZXNzLCBnZXRIaXN0b3J5LCBzZXRGZWVkYmFjayB9O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2hpcChsZW5ndGgpIHtcbiAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKGxlbmd0aCkpXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignbGVuZ3RoIG11c3QgYmUgYW4gaW50ZWdlcicpO1xuICBlbHNlIGlmIChsZW5ndGggPCAwKVxuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdTaGlwIGxlbmd0aCBjYW5ub3QgYmUgbGVzcyB0aGFuIHplcm8nKTtcbiAgbGV0IHggPSAwO1xuICBsZXQgeSA9IDA7XG4gIGxldCBob3Jpem9udGFsID0gZmFsc2U7XG4gIGxldCBoaXRzID0gW107XG5cbiAgbGV0IGdldExlbmd0aCA9ICgpID0+IHtcbiAgICByZXR1cm4gbGVuZ3RoO1xuICB9O1xuXG4gIGxldCBzZXRPcmlnaW4gPSAobmV3WCwgbmV3WSkgPT4ge1xuICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcihuZXdYKSkgdGhyb3cgbmV3IFR5cGVFcnJvcigneCBtdXN0IGJlIGFuIGludGVnZXInKTtcbiAgICBlbHNlIGlmICghTnVtYmVyLmlzSW50ZWdlcihuZXdZKSlcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3kgbXVzdCBiZSBhbiBpbnRlZ2VyJyk7XG5cbiAgICB4ID0gbmV3WDtcbiAgICB5ID0gbmV3WTtcbiAgfTtcblxuICBsZXQgZ2V0T3JpZ2luID0gKCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICB4LFxuICAgICAgeSxcbiAgICB9O1xuICB9O1xuXG4gIGxldCBpc0hvcml6b250YWwgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGhvcml6b250YWw7XG4gIH07XG5cbiAgbGV0IHNldEhvcml6b250YWwgPSAodmFsdWUpID0+IHtcbiAgICBob3Jpem9udGFsID0gISF2YWx1ZTtcbiAgfTtcblxuICBsZXQgaGl0ID0gKHRhcmdldFgsIHRhcmdldFkpID0+IHtcbiAgICBpZiAoIU51bWJlci5pc0ludGVnZXIodGFyZ2V0WCkpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0YXJnZXRYIG11c3QgYmUgYW4gaW50ZWdlcicpO1xuICAgIGVsc2UgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKHRhcmdldFkpKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndGFyZ2V0WSBtdXN0IGJlIGFuIGludGVnZXInKTtcblxuICAgIGxldCBzdWNjZXNzID1cbiAgICAgIChob3Jpem9udGFsICYmIHkgPT09IHRhcmdldFkgJiYgdGFyZ2V0WCA+PSB4ICYmIHRhcmdldFggPCB4ICsgbGVuZ3RoKSB8fFxuICAgICAgKCFob3Jpem9udGFsICYmIHggPT09IHRhcmdldFggJiYgdGFyZ2V0WSA+PSB5ICYmIHRhcmdldFkgPCB5ICsgbGVuZ3RoKTtcbiAgICBpZiAoc3VjY2VzcykgaGl0cy5wdXNoKHsgeDogdGFyZ2V0WCwgeTogdGFyZ2V0WSB9KTtcbiAgICByZXR1cm4gc3VjY2VzcztcbiAgfTtcblxuICBsZXQgaXNTdW5rID0gKCkgPT4ge1xuICAgIGlmIChoaXRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiBoaXRzLmV2ZXJ5KCh2KSA9PiB7XG4gICAgICBpZiAoaG9yaXpvbnRhbCkgcmV0dXJuIHYueSA9PT0geSAmJiB2LnggPj0geCAmJiB2LnggPCB4ICsgbGVuZ3RoO1xuICAgICAgZWxzZSByZXR1cm4gdi54ID09PSB4ICYmIHYueSA+PSB5ICYmIHYueSA8IHkgKyBsZW5ndGg7XG4gICAgfSk7XG4gIH07XG5cbiAgbGV0IHJlc2V0SGl0cyA9ICgpID0+IChoaXRzLmxlbmd0aCA9IDApO1xuICByZXR1cm4ge1xuICAgIGdldExlbmd0aCxcbiAgICBnZXRPcmlnaW4sXG4gICAgc2V0T3JpZ2luLFxuICAgIGlzSG9yaXpvbnRhbCxcbiAgICBzZXRIb3Jpem9udGFsLFxuICAgIGhpdCxcbiAgICBpc1N1bmssXG4gICAgcmVzZXRIaXRzLFxuICB9O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIFNoaXBOYW1lcygpIHtcbiAgcmV0dXJuIHtcbiAgICBDYXJyaWVyOiAnQ2FycmllcicsXG4gICAgQmF0dGxlc2hpcDogJ0JhdHRsZXNoaXAnLFxuICAgIERlc3Ryb3llcjogJ0Rlc3Ryb3llcicsXG4gICAgU3VibWFyaW5lOiAnU3VibWFyaW5lJyxcbiAgICBQYXRyb2xCb2F0OiAnUGF0cm9sQm9hdCcsXG4gIH07XG59KSgpO1xuIiwiaW1wb3J0IFNoaXBOYW1lcyBmcm9tICcuL1NoaXBOYW1lcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNoaXB5YXJkKGNvbnRhaW5lciwgbmFtZSkge1xuICBsZXQgc2hpcHlhcmQgPSB7fTtcbiAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBkaXYuY2xhc3NMaXN0LmFkZChuYW1lICsgJ3NoaXB5YXJkJyk7XG4gIHNoaXB5YXJkLm9uU2hpcENsaWNrID0ge307XG4gIHNoaXB5YXJkLm9uU2hpcERyYWdTdGFydCA9IHt9O1xuXG4gIGZvciAoY29uc3Qgc2hpcE5hbWUgaW4gU2hpcE5hbWVzKSB7XG4gICAgbGV0IHNoaXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBzaGlwLmNsYXNzTGlzdC5hZGQoc2hpcE5hbWUpO1xuICAgIHNoaXAuaWQgPSBuYW1lICsgc2hpcE5hbWU7XG4gICAgc2hpcC5jbGFzc0xpc3QuYWRkKCdzaGlwJyk7XG4gICAgc2hpcC5jbGFzc0xpc3QuYWRkKCd2ZXJ0aWNhbFNoaXAnKTtcbiAgICBzaGlwLnN0eWxlLmdyaWRBcmVhID0gc2hpcE5hbWU7XG4gICAgc2hpcC5kcmFnZ2FibGUgPSB0cnVlO1xuICAgIHNoaXAub25kcmFnc3RhcnQgPSAoZSkgPT4ge1xuICAgICAgaWYgKHNoaXB5YXJkLm9uU2hpcERyYWdTdGFydCBpbnN0YW5jZW9mIEZ1bmN0aW9uKVxuICAgICAgICBzaGlweWFyZC5vblNoaXBEcmFnU3RhcnQoZSwgc2hpcE5hbWUpO1xuICAgIH07XG4gICAgc2hpcC5vbmNsaWNrID0gKGUpID0+IHtcbiAgICAgIGlmIChzaGlweWFyZC5vblNoaXBDbGljayBpbnN0YW5jZW9mIEZ1bmN0aW9uKVxuICAgICAgICBzaGlweWFyZC5vblNoaXBDbGljayhlLCBzaGlwTmFtZSk7XG4gICAgfTtcbiAgICBzaGlwLnRleHRDb250ZW50ID0gc2hpcE5hbWU7XG4gICAgZGl2LmFwcGVuZENoaWxkKHNoaXApO1xuICB9XG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkaXYpO1xuICByZXR1cm4gc2hpcHlhcmQ7XG59XG4iLCJpbXBvcnQgQm9hcmQgZnJvbSAnLi9Cb2FyZCc7XG5pbXBvcnQgU2hpcE5hbWVzIGZyb20gJy4vU2hpcE5hbWVzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2ltcGxlQUkoKSB7XG4gIGxldCBzaXplID0gMTA7XG4gIGxldCByZW1haW5pbmdHdWVzc2VzID0gW107XG4gIGxldCBoaXN0b3J5ID0gW107XG4gIGxldCBzaGlwcyA9IHt9O1xuXG4gIGxldCBnZXRSYW5kb21Qb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgbWluID0gMDtcbiAgICBsZXQgbWF4ID0gc2l6ZTtcbiAgICByZXR1cm4ge1xuICAgICAgeDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbixcbiAgICAgIHk6IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW4sXG4gICAgICBob3Jpem9udGFsOiBNYXRoLnJhbmRvbSgpIDwgMC41LFxuICAgIH07XG4gIH07XG5cbiAgbGV0IHNodWZmbGVTaGlwUG9zaXRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCBib2FyZCA9IEJvYXJkKHNpemUpO1xuXG4gICAgZm9yIChjb25zdCBuYW1lIGluIFNoaXBOYW1lcykge1xuICAgICAgbGV0IHBvcyA9IGdldFJhbmRvbVBvc2l0aW9uKCk7XG4gICAgICB3aGlsZSAoIWJvYXJkLmlzVmFsaWRTaGlwUGxhY2VtZW50KG5hbWUsIHBvcy54LCBwb3MueSwgcG9zLmhvcml6b250YWwpKSB7XG4gICAgICAgIHBvcyA9IGdldFJhbmRvbVBvc2l0aW9uKCk7XG4gICAgICB9XG4gICAgICBib2FyZC5wbGFjZVNoaXAobmFtZSwgcG9zLngsIHBvcy55LCBwb3MuaG9yaXpvbnRhbCk7XG4gICAgICBzaGlwc1tuYW1lXSA9IHBvcztcbiAgICB9XG4gIH07XG5cbiAgbGV0IGdldFNoaXBQb3NpdGlvbiA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgcmV0dXJuIHNoaXBzW25hbWVdO1xuICB9O1xuXG4gIGxldCBnZXRHdWVzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgaSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJlbWFpbmluZ0d1ZXNzZXMubGVuZ3RoKTtcbiAgICBsZXQgZ3Vlc3MgPSByZW1haW5pbmdHdWVzc2VzW2ldO1xuICAgIGd1ZXNzLmlzSGl0ID0gZmFsc2U7XG4gICAgaGlzdG9yeS5wdXNoKGd1ZXNzKTtcbiAgICByZW1haW5pbmdHdWVzc2VzLnNwbGljZShpLCAxKTtcbiAgICByZXR1cm4gZ3Vlc3M7XG4gIH07XG5cbiAgbGV0IHNldEZlZWRiYWNrID0gZnVuY3Rpb24gKGlzSGl0KSB7XG4gICAgaGlzdG9yeVtoaXN0b3J5Lmxlbmd0aCAtIDFdLmlzSGl0ID0gaXNIaXQ7XG4gIH07XG5cbiAgbGV0IGdldEhpc3RvcnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFsuLi5oaXN0b3J5XTtcbiAgfTtcblxuICBsZXQgcmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgc2h1ZmZsZVNoaXBQb3NpdGlvbnMoKTtcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHNpemU7IHgrKykge1xuICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBzaXplOyB5KyspIHtcbiAgICAgICAgcmVtYWluaW5nR3Vlc3Nlcy5wdXNoKHsgeCwgeSB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgcmVzZXQoKTtcbiAgcmV0dXJuIHsgZ2V0R3Vlc3MsIGdldEhpc3RvcnksIGdldFNoaXBQb3NpdGlvbiwgcmVzZXQsIHNldEZlZWRiYWNrIH07XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBCYXR0bGVzaGlwIGZyb20gJy4vQmF0dGxlc2hpcCc7XG5pbXBvcnQgRGlzcGxheSBmcm9tICcuL0Rpc3BsYXknO1xuaW1wb3J0IFBsYXllciBmcm9tICcuL1BsYXllcic7XG5pbXBvcnQgU2ltcGxlQUkgZnJvbSAnLi9TaW1wbGVBSSc7XG5cbmxldCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFpbmVyJyk7XG5sZXQgcGxheWVyID0gUGxheWVyKCk7XG5sZXQgb3Bwb25lbnQgPSBTaW1wbGVBSSgpO1xubGV0IGJhdHRsZXNoaXAgPSBCYXR0bGVzaGlwKHBsYXllciwgb3Bwb25lbnQpO1xubGV0IGRpc3BsYXkgPSBEaXNwbGF5KGJhdHRsZXNoaXAsIHBsYXllciwgb3Bwb25lbnQsIGNvbnRhaW5lcik7XG5iYXR0bGVzaGlwLm9uRHJhdyA9ICgpID0+IHtcbiAgZGlzcGxheS5kcmF3KCk7XG59O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9