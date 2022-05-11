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
      p2Board.placeShip(name, x, y);
  };

  obj.getShipInfo = function (name, isPlayer1) {
    return isPlayer1 ? p1Board.getShipInfo(name) : p2Board.getShipInfo(name);
  };

  let nextTurn = async function () {
    let currentBoard = isP1Turn ? p1Board : p2Board;
    let currentPlayer = isP1Turn ? player1 : player2;
    let guess = await currentPlayer.getGuess();
    console.log(guess);
    if (!isValidGuess(guess.x, guess.y))
      throw new RangeError(
        `Player ${isP1Turn ? '1' : '2'} guess is invalid. (${guess})`
      );

    currentBoard.hit(guess.x, guess.y);
    if (obj.onDraw instanceof Function) {
      obj.onDraw();
    }
    // throw error if invalid guess
    // p1Board.hit(guess.x, guess.y);
    // draw();
    // if (isWinner()) endGame();
    // else {
    //   isP1Turn = !isP1Turn;
    //   nextTurn();
    // }
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
        `x must be less than the size of the board (${size})`
      );
    if (!horizontal && y + ships[name].getLength() - 1 >= size)
      throw new RangeError(
        `y must be less than the size of the board (${size})`
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
    // set opponent stuff
    battleship.start();
  };
  startDiv.appendChild(start);
  container.appendChild(startDiv);

  let drawShips = function () {
    for (const name in _ShipNames__WEBPACK_IMPORTED_MODULE_1__["default"]) {
      playerDisplay.drawShip(name, battleship.getShipInfo(name));
    }
  };

  let drawGuesses = function () {
    player.getHistory().forEach((e) => {
      opponentDisplay.drawGuess(e.x, e.y, true);
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
    let ret = { x: guess.x, y: guess.y };
    history.push(ret);
    guess = undefined;
    return ret;
  };

  let setGuess = function (x, y) {
    guess = { x: x, y: y };
  };

  let getHistory = function () {
    return [...history];
  };

  return { getGuess, setGuess, getHistory };
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




let container = document.getElementById('container');
// let opponent = new DisplayBoard(container);
// let board = Board(10);
// let player = new DisplayBoard(container, board);
// let shipyard = new ShipyardDisplay(container, board);
let player = (0,_Player__WEBPACK_IMPORTED_MODULE_2__["default"])();
let opponent = (0,_Player__WEBPACK_IMPORTED_MODULE_2__["default"])();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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OztBQUVyQjtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUJBQXFCLGtEQUFTO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztVQzlCQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7QUNOc0M7QUFDTjtBQUNGOztBQUU5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxtREFBTTtBQUNuQixlQUFlLG1EQUFNO0FBQ3JCLGlCQUFpQix1REFBVTtBQUMzQixjQUFjLG9EQUFPO0FBQ3JCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsRUFBRTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9CYXR0bGVzaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvQm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9EaXNwbGF5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvRGlzcGxheUJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvUGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvU2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL1NoaXBOYW1lcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL1NoaXB5YXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCb2FyZCBmcm9tICcuL0JvYXJkJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQmF0dGxlc2hpcChwbGF5ZXIxLCBwbGF5ZXIyKSB7XG4gIGxldCBvYmogPSB7fTtcbiAgbGV0IHNpemUgPSAxMDtcbiAgbGV0IHAxQm9hcmQgPSBCb2FyZChzaXplKTtcbiAgbGV0IHAyQm9hcmQgPSBCb2FyZChzaXplKTtcbiAgbGV0IGlzUDFUdXJuID0gdHJ1ZTtcbiAgb2JqLm9uRHJhdyA9IHt9O1xuXG4gIGxldCBpc1ZhbGlkR3Vlc3MgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgIHJldHVybiB4ID49IDAgJiYgeCA8IHNpemUgJiYgeSA+PSAwICYmIHkgPCBzaXplO1xuICB9O1xuXG4gIG9iai5wbGFjZVNoaXAgPSBmdW5jdGlvbiAobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCwgaXNQbGF5ZXIxKSB7XG4gICAgaWYgKGlzUGxheWVyMSAmJiBwMUJvYXJkLmlzVmFsaWRTaGlwUGxhY2VtZW50KG5hbWUsIHgsIHksIGhvcml6b250YWwpKVxuICAgICAgcDFCb2FyZC5wbGFjZVNoaXAobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCk7XG4gICAgZWxzZSBpZiAocDJCb2FyZC5pc1ZhbGlkU2hpcFBsYWNlbWVudChuYW1lLCB4LCB5LCBob3Jpem9udGFsKSlcbiAgICAgIHAyQm9hcmQucGxhY2VTaGlwKG5hbWUsIHgsIHkpO1xuICB9O1xuXG4gIG9iai5nZXRTaGlwSW5mbyA9IGZ1bmN0aW9uIChuYW1lLCBpc1BsYXllcjEpIHtcbiAgICByZXR1cm4gaXNQbGF5ZXIxID8gcDFCb2FyZC5nZXRTaGlwSW5mbyhuYW1lKSA6IHAyQm9hcmQuZ2V0U2hpcEluZm8obmFtZSk7XG4gIH07XG5cbiAgbGV0IG5leHRUdXJuID0gYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgIGxldCBjdXJyZW50Qm9hcmQgPSBpc1AxVHVybiA/IHAxQm9hcmQgOiBwMkJvYXJkO1xuICAgIGxldCBjdXJyZW50UGxheWVyID0gaXNQMVR1cm4gPyBwbGF5ZXIxIDogcGxheWVyMjtcbiAgICBsZXQgZ3Vlc3MgPSBhd2FpdCBjdXJyZW50UGxheWVyLmdldEd1ZXNzKCk7XG4gICAgY29uc29sZS5sb2coZ3Vlc3MpO1xuICAgIGlmICghaXNWYWxpZEd1ZXNzKGd1ZXNzLngsIGd1ZXNzLnkpKVxuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXG4gICAgICAgIGBQbGF5ZXIgJHtpc1AxVHVybiA/ICcxJyA6ICcyJ30gZ3Vlc3MgaXMgaW52YWxpZC4gKCR7Z3Vlc3N9KWBcbiAgICAgICk7XG5cbiAgICBjdXJyZW50Qm9hcmQuaGl0KGd1ZXNzLngsIGd1ZXNzLnkpO1xuICAgIGlmIChvYmoub25EcmF3IGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgIG9iai5vbkRyYXcoKTtcbiAgICB9XG4gICAgLy8gdGhyb3cgZXJyb3IgaWYgaW52YWxpZCBndWVzc1xuICAgIC8vIHAxQm9hcmQuaGl0KGd1ZXNzLngsIGd1ZXNzLnkpO1xuICAgIC8vIGRyYXcoKTtcbiAgICAvLyBpZiAoaXNXaW5uZXIoKSkgZW5kR2FtZSgpO1xuICAgIC8vIGVsc2Uge1xuICAgIC8vICAgaXNQMVR1cm4gPSAhaXNQMVR1cm47XG4gICAgLy8gICBuZXh0VHVybigpO1xuICAgIC8vIH1cbiAgfTtcblxuICBvYmouc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaXNQMVR1cm4gPSB0cnVlO1xuICAgIG5leHRUdXJuKCk7XG4gIH07XG4gIHJldHVybiBvYmo7XG59XG4iLCJpbXBvcnQgU2hpcCBmcm9tICcuL1NoaXAnO1xuaW1wb3J0IFNoaXBOYW1lcyBmcm9tICcuL1NoaXBOYW1lcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJvYXJkKHNpemUpIHtcbiAgbGV0IHNoaXBzID0ge307XG4gIHNoaXBzW1NoaXBOYW1lcy5DYXJyaWVyXSA9IFNoaXAoNSk7XG4gIHNoaXBzW1NoaXBOYW1lcy5CYXR0bGVzaGlwXSA9IFNoaXAoNCk7XG4gIHNoaXBzW1NoaXBOYW1lcy5EZXN0cm95ZXJdID0gU2hpcCgzKTtcbiAgc2hpcHNbU2hpcE5hbWVzLlN1Ym1hcmluZV0gPSBTaGlwKDMpO1xuICBzaGlwc1tTaGlwTmFtZXMuUGF0cm9sQm9hdF0gPSBTaGlwKDIpO1xuICBsZXQgcGxhY2VkU2hpcHMgPSBbXTtcbiAgbGV0IHZhbGlkYXRlU2hpcEluZm8gPSBmdW5jdGlvbiAobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCkge1xuICAgIGlmIChzaGlwc1tuYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvcjogbmFtZSBtdXN0IGJlIGEgdmFsaWQgc2hpcCBuYW1lJyk7XG4gICAgaWYgKHggPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcigneCBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB6ZXJvJyk7XG4gICAgaWYgKHkgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcigneSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB6ZXJvJyk7XG4gICAgaWYgKGhvcml6b250YWwgJiYgeCArIHNoaXBzW25hbWVdLmdldExlbmd0aCgpIC0gMSA+PSBzaXplKVxuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXG4gICAgICAgIGB4IG11c3QgYmUgbGVzcyB0aGFuIHRoZSBzaXplIG9mIHRoZSBib2FyZCAoJHtzaXplfSlgXG4gICAgICApO1xuICAgIGlmICghaG9yaXpvbnRhbCAmJiB5ICsgc2hpcHNbbmFtZV0uZ2V0TGVuZ3RoKCkgLSAxID49IHNpemUpXG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcbiAgICAgICAgYHkgbXVzdCBiZSBsZXNzIHRoYW4gdGhlIHNpemUgb2YgdGhlIGJvYXJkICgke3NpemV9KWBcbiAgICAgICk7XG4gIH07XG5cbiAgbGV0IGlzVmFsaWRTaGlwUGxhY2VtZW50ID0gZnVuY3Rpb24gKG5hbWUsIHgsIHksIGhvcml6b250YWwpIHtcbiAgICBpZiAoc2hpcHNbbmFtZV0gPT09IHVuZGVmaW5lZClcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3I6IG5hbWUgbXVzdCBiZSBhIHZhbGlkIHNoaXAgbmFtZScpO1xuICAgIGxldCBsZWZ0ID0geDtcbiAgICBsZXQgdG9wID0geTtcbiAgICBsZXQgcmlnaHQgPSBob3Jpem9udGFsID8gbGVmdCArIHNoaXBzW25hbWVdLmdldExlbmd0aCgpIC0gMSA6IGxlZnQ7XG4gICAgbGV0IGJvdHRvbSA9IGhvcml6b250YWwgPyB0b3AgOiB0b3AgKyBzaGlwc1tuYW1lXS5nZXRMZW5ndGgoKSAtIDE7XG4gICAgaWYgKGxlZnQgPCAwIHx8IHJpZ2h0IDwgMCB8fCByaWdodCA+PSBzaXplIHx8IGJvdHRvbSA+PSBzaXplKSByZXR1cm4gZmFsc2U7XG5cbiAgICByZXR1cm4gIXBsYWNlZFNoaXBzLnNvbWUoKHZhbCkgPT4ge1xuICAgICAgaWYgKHZhbCAhPT0gbmFtZSkge1xuICAgICAgICBsZXQgbCA9IHNoaXBzW3ZhbF0uZ2V0T3JpZ2luKCkueDtcbiAgICAgICAgbGV0IHQgPSBzaGlwc1t2YWxdLmdldE9yaWdpbigpLnk7XG4gICAgICAgIGxldCByID0gc2hpcHNbdmFsXS5pc0hvcml6b250YWwoKSA/IGwgKyBzaGlwc1t2YWxdLmdldExlbmd0aCgpIC0gMSA6IGw7XG4gICAgICAgIGxldCBiID0gc2hpcHNbdmFsXS5pc0hvcml6b250YWwoKSA/IHQgOiB0ICsgc2hpcHNbdmFsXS5nZXRMZW5ndGgoKSAtIDE7XG4gICAgICAgIC8vIHNoaXBzIGNvbGxpZGVcbiAgICAgICAgaWYgKFxuICAgICAgICAgICgobGVmdCA+PSBsICYmIGxlZnQgPD0gcikgfHwgKHJpZ2h0ID49IGwgJiYgcmlnaHQgPD0gcikpICYmXG4gICAgICAgICAgKCh0b3AgPj0gdCAmJiB0b3AgPD0gYikgfHwgKGJvdHRvbSA+PSB0ICYmIGJvdHRvbSA8PSBiKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBsZXQgcGxhY2VTaGlwID0gZnVuY3Rpb24gKG5hbWUsIHgsIHksIGhvcml6b250YWwpIHtcbiAgICB2YWxpZGF0ZVNoaXBJbmZvKG5hbWUsIHgsIHksIGhvcml6b250YWwpO1xuICAgIGlmICghaXNWYWxpZFNoaXBQbGFjZW1lbnQobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCkpIHJldHVybiBmYWxzZTtcbiAgICBzaGlwc1tuYW1lXS5zZXRPcmlnaW4oeCwgeSk7XG4gICAgc2hpcHNbbmFtZV0uc2V0SG9yaXpvbnRhbChob3Jpem9udGFsKTtcbiAgICBpZiAoIXBsYWNlZFNoaXBzLmluY2x1ZGVzKG5hbWUpKSBwbGFjZWRTaGlwcy5wdXNoKG5hbWUpO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIGxldCByZW1vdmVTaGlwID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBpZiAoc2hpcHNbbmFtZV0gPT09IHVuZGVmaW5lZClcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3I6IG5hbWUgbXVzdCBiZSBhIHZhbGlkIHNoaXAgbmFtZScpO1xuICAgIHBsYWNlZFNoaXBzID0gcGxhY2VkU2hpcHMuZmlsdGVyKCh2KSA9PiB2ICE9PSBuYW1lKTtcbiAgICBzaGlwc1tuYW1lXS5yZXNldEhpdHMoKTtcbiAgfTtcblxuICBsZXQgaGl0ID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gc2hpcHMpIHtcbiAgICAgIGlmIChwbGFjZWRTaGlwcy5pbmNsdWRlcyhuYW1lKSAmJiBzaGlwc1tuYW1lXS5oaXQoeCwgeSkpIHJldHVybiBuYW1lO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgbGV0IGlzU3VuayA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgaWYgKHNoaXBzW25hbWVdID09PSB1bmRlZmluZWQpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yOiBuYW1lIG11c3QgYmUgYSB2YWxpZCBzaGlwIG5hbWUnKTtcbiAgICByZXR1cm4gc2hpcHNbbmFtZV0uaXNTdW5rKCk7XG4gIH07XG5cbiAgbGV0IGdldFNoaXBJbmZvID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBpZiAoc2hpcHNbbmFtZV0gPT09IHVuZGVmaW5lZClcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3I6IG5hbWUgbXVzdCBiZSBhIHZhbGlkIHNoaXAgbmFtZScpO1xuICAgIGlmICghcGxhY2VkU2hpcHMuaW5jbHVkZXMobmFtZSkpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9yaWdpbjogc2hpcHNbbmFtZV0uZ2V0T3JpZ2luKCksXG4gICAgICBob3Jpem9udGFsOiBzaGlwc1tuYW1lXS5pc0hvcml6b250YWwoKSxcbiAgICAgIHN1bms6IHNoaXBzW25hbWVdLmlzU3VuaygpLFxuICAgICAgbGVuZ3RoOiBzaGlwc1tuYW1lXS5nZXRMZW5ndGgoKSxcbiAgICB9O1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgcGxhY2VTaGlwLFxuICAgIHJlbW92ZVNoaXAsXG4gICAgaGl0LFxuICAgIGlzU3VuayxcbiAgICBnZXRTaGlwSW5mbyxcbiAgICBpc1ZhbGlkU2hpcFBsYWNlbWVudCxcbiAgfTtcbn1cbiIsImltcG9ydCBEaXNwbGF5Qm9hcmQgZnJvbSAnLi9EaXNwbGF5Qm9hcmQnO1xuaW1wb3J0IFNoaXBOYW1lcyBmcm9tICcuL1NoaXBOYW1lcyc7XG5pbXBvcnQgU2hpcHlhcmQgZnJvbSAnLi9TaGlweWFyZCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIERpc3BsYXkoYmF0dGxlc2hpcCwgcGxheWVyLCBvcHBvbmVudCwgY29udGFpbmVyKSB7XG4gIGxldCBvcHBvbmVudERpc3BsYXkgPSBEaXNwbGF5Qm9hcmQoY29udGFpbmVyKTtcbiAgbGV0IHBsYXllckRpc3BsYXkgPSBEaXNwbGF5Qm9hcmQoY29udGFpbmVyKTtcblxuICBsZXQgaXNBbGxTaGlwc1BsYWNlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoU2hpcE5hbWVzKS5ldmVyeShcbiAgICAgIChuYW1lKSA9PiBiYXR0bGVzaGlwLmdldFNoaXBJbmZvKG5hbWUsIHRydWUpICE9PSB1bmRlZmluZWRcbiAgICApO1xuICB9O1xuICBwbGF5ZXJEaXNwbGF5Lm9uQ2VsbERyb3AgPSAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBsZXQgaW5mbyA9IEpTT04ucGFyc2UoZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgndGV4dCcpKTtcbiAgICBsZXQgb3JpZ2luID0gcGxheWVyRGlzcGxheS5jZWxsRnJvbVBvaW50KFxuICAgICAgZS54IC0gZS5vZmZzZXRYIC0gaW5mby5vZmZzZXRYICsgMjUsXG4gICAgICBlLnkgLSBlLm9mZnNldFkgLSBpbmZvLm9mZnNldFkgKyAyNVxuICAgICk7XG4gICAgaWYgKG9yaWdpbiAhPT0gdW5kZWZpbmVkKVxuICAgICAgYmF0dGxlc2hpcC5wbGFjZVNoaXAoXG4gICAgICAgIGluZm8ubmFtZSxcbiAgICAgICAgb3JpZ2luLngsXG4gICAgICAgIG9yaWdpbi55LFxuICAgICAgICBpbmZvLmhvcml6b250YWwsXG4gICAgICAgIHRydWVcbiAgICAgICk7XG4gICAgcGxheWVyRGlzcGxheS5kcmF3U2hpcChpbmZvLm5hbWUsIGJhdHRsZXNoaXAuZ2V0U2hpcEluZm8oaW5mby5uYW1lLCB0cnVlKSk7XG4gICAgaWYgKGlzQWxsU2hpcHNQbGFjZWQoKSkgc3RhcnQuZGlzYWJsZWQgPSBmYWxzZTtcbiAgfTtcbiAgb3Bwb25lbnREaXNwbGF5Lm9uQ2VsbENsaWNrID0gKGUpID0+IHtcbiAgICBsZXQgb3JpZ2luID0gb3Bwb25lbnREaXNwbGF5LmNlbGxGcm9tUG9pbnQoXG4gICAgICBlLnggLSBlLm9mZnNldFgsXG4gICAgICBlLnkgLSBlLm9mZnNldFlcbiAgICApO1xuICAgIHBsYXllci5zZXRHdWVzcyhvcmlnaW4ueCwgb3JpZ2luLnkpO1xuICB9O1xuXG4gIGxldCBzaGlweWFyZCA9IFNoaXB5YXJkKGNvbnRhaW5lcik7XG4gIHNoaXB5YXJkLm9uU2hpcERyYWdTdGFydCA9IChlLCBuYW1lKSA9PiB7XG4gICAgbGV0IGluZm8gPSBiYXR0bGVzaGlwLmdldFNoaXBJbmZvKG5hbWUsIHRydWUpO1xuICAgIGxldCBob3Jpem9udGFsID0gaW5mbyA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBpbmZvLmhvcml6b250YWw7XG4gICAgZS5kYXRhVHJhbnNmZXIuc2V0RGF0YShcbiAgICAgICd0ZXh0JyxcbiAgICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgbmFtZTogZS50YXJnZXQuaWQsXG4gICAgICAgIG9mZnNldFg6IGUub2Zmc2V0WCxcbiAgICAgICAgb2Zmc2V0WTogZS5vZmZzZXRZLFxuICAgICAgICBob3Jpem9udGFsOiBob3Jpem9udGFsLFxuICAgICAgfSlcbiAgICApO1xuICB9O1xuICBzaGlweWFyZC5vblNoaXBDbGljayA9IChlLCBuYW1lKSA9PiB7XG4gICAgbGV0IGluZm8gPSBiYXR0bGVzaGlwLmdldFNoaXBJbmZvKG5hbWUsIHRydWUpO1xuICAgIGlmIChpbmZvID09PSB1bmRlZmluZWQpIHJldHVybjtcbiAgICBiYXR0bGVzaGlwLnBsYWNlU2hpcChcbiAgICAgIG5hbWUsXG4gICAgICBpbmZvLm9yaWdpbi54LFxuICAgICAgaW5mby5vcmlnaW4ueSxcbiAgICAgICFpbmZvLmhvcml6b250YWwsXG4gICAgICB0cnVlXG4gICAgKTtcbiAgICBwbGF5ZXJEaXNwbGF5LmRyYXdTaGlwKG5hbWUsIGJhdHRsZXNoaXAuZ2V0U2hpcEluZm8obmFtZSwgdHJ1ZSkpO1xuICB9O1xuXG4gIGxldCBzdGFydERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBsZXQgc3RhcnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgc3RhcnQuY2xhc3NMaXN0LmFkZCgnc3RhcnQnKTtcbiAgc3RhcnQuZGlzYWJsZWQgPSB0cnVlO1xuICBzdGFydC50ZXh0Q29udGVudCA9ICdTdGFydCBHYW1lJztcbiAgc3RhcnQub25jbGljayA9ICgpID0+IHtcbiAgICAvLyBzZXQgb3Bwb25lbnQgc3R1ZmZcbiAgICBiYXR0bGVzaGlwLnN0YXJ0KCk7XG4gIH07XG4gIHN0YXJ0RGl2LmFwcGVuZENoaWxkKHN0YXJ0KTtcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKHN0YXJ0RGl2KTtcblxuICBsZXQgZHJhd1NoaXBzID0gZnVuY3Rpb24gKCkge1xuICAgIGZvciAoY29uc3QgbmFtZSBpbiBTaGlwTmFtZXMpIHtcbiAgICAgIHBsYXllckRpc3BsYXkuZHJhd1NoaXAobmFtZSwgYmF0dGxlc2hpcC5nZXRTaGlwSW5mbyhuYW1lKSk7XG4gICAgfVxuICB9O1xuXG4gIGxldCBkcmF3R3Vlc3NlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICBwbGF5ZXIuZ2V0SGlzdG9yeSgpLmZvckVhY2goKGUpID0+IHtcbiAgICAgIG9wcG9uZW50RGlzcGxheS5kcmF3R3Vlc3MoZS54LCBlLnksIHRydWUpO1xuICAgIH0pO1xuICB9O1xuXG4gIGxldCBkcmF3ID0gZnVuY3Rpb24gKCkge1xuICAgIGRyYXdTaGlwcygpO1xuICAgIGRyYXdHdWVzc2VzKCk7XG4gICAgLy8gZm9yIGVhY2ggcGxhY2VkIHNoaXAgZHJhdyBzaGlwIG9uIHBsYXllciBib2FyZFxuICAgIC8vIGZvciBlYWNoIHBsYXllciBndWVzcyBkcmF3IHggb3IgbyBvbiBvcHBvbmVudCBib2FyZFxuICAgIC8vIGZvciBlYWNoIG9wcG9uZW50IGd1ZXNzIGRyYXcgeCBvciBvIG9uIHBsYXllciBib2FyZFxuICB9O1xuICByZXR1cm4geyBkcmF3IH07XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBEaXNwbGF5Qm9hcmQoY29udGFpbmVyKSB7XG4gIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGl2LmNsYXNzTGlzdC5hZGQoJ2JvYXJkJyk7XG5cbiAgbGV0IGRpc3BsYXlCb2FyZCA9IHt9O1xuICBkaXNwbGF5Qm9hcmQub25DZWxsRHJvcCA9IHt9O1xuICBkaXNwbGF5Qm9hcmQub25DZWxsQ2xpY2sgPSB7fTtcbiAgZGlzcGxheUJvYXJkLmNlbGxGcm9tUG9pbnQgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgIGxldCBjZWxsID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludCh4LCB5KTtcbiAgICBpZiAoY2VsbC5jbGFzc0xpc3QuY29udGFpbnMoJ2NlbGwnKSAmJiBkaXYuY29udGFpbnMoY2VsbCkpXG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShjZWxsLmlkKTtcbiAgICBlbHNlIHJldHVybiB1bmRlZmluZWQ7XG4gIH07XG5cbiAgZGlzcGxheUJvYXJkLmRyYXdTaGlwID0gZnVuY3Rpb24gKG5hbWUsIGluZm8pIHtcbiAgICBpZiAoaW5mbyAhPSB1bmRlZmluZWQpIHtcbiAgICAgIGxldCBzaGlwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmFtZSk7XG4gICAgICBsZXQgcmlnaHQgPSBpbmZvLm9yaWdpbi54ICsgMztcbiAgICAgIGxldCBib3R0b20gPSBpbmZvLm9yaWdpbi55ICsgMztcbiAgICAgIGlmIChpbmZvLmhvcml6b250YWwpIHtcbiAgICAgICAgcmlnaHQgKz0gaW5mby5sZW5ndGggLSAxO1xuICAgICAgICBzaGlwLmNsYXNzTGlzdC5yZW1vdmUoJ3ZlcnRpY2FsU2hpcCcpO1xuICAgICAgICBzaGlwLmNsYXNzTGlzdC5hZGQoJ2hvcml6b250YWxTaGlwJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBib3R0b20gKz0gaW5mby5sZW5ndGggLSAxO1xuICAgICAgICBzaGlwLmNsYXNzTGlzdC5yZW1vdmUoJ2hvcml6b250YWxTaGlwJyk7XG4gICAgICAgIHNoaXAuY2xhc3NMaXN0LmFkZCgndmVydGljYWxTaGlwJyk7XG4gICAgICB9XG4gICAgICBzaGlwLnN0eWxlLmdyaWRBcmVhID0gYFxuICAgICAgICAgICAgJHtpbmZvLm9yaWdpbi55ICsgMn0gL1xuICAgICAgICAgICAgJHtpbmZvLm9yaWdpbi54ICsgMn0gL1xuICAgICAgICAgICAgJHtib3R0b219IC9cbiAgICAgICAgICAgICR7cmlnaHR9YDtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZChzaGlwKTtcbiAgICB9XG4gIH07XG5cbiAgZGlzcGxheUJvYXJkLmRyYXdHdWVzcyA9IGZ1bmN0aW9uICh4LCB5LCBpc0hpdCkge1xuICAgIGxldCBjZWxsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoSlNPTi5zdHJpbmdpZnkoeyB4LCB5IH0pKTtcbiAgICBjZWxsLnRleHRDb250ZW50ID0gaXNIaXQgPyAnWCcgOiAnMCc7XG4gIH07XG5cbiAgbGV0IHNldHVwQ2VsbHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPCAxMTsgeSsrKSB7XG4gICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDExOyB4KyspIHtcbiAgICAgICAgbGV0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgY2VsbC5pZCA9IEpTT04uc3RyaW5naWZ5KHsgeDogeCAtIDEsIHk6IHkgLSAxIH0pO1xuICAgICAgICBjZWxsLnN0eWxlLmdyaWRBcmVhID0gYCR7eSArIDF9IC8gJHt4ICsgMX0gLyAke3kgKyAyfSAvICR7eCArIDJ9YDtcbiAgICAgICAgaWYgKHkgPT09IDAgJiYgeCA+IDApIHtcbiAgICAgICAgICBjZWxsLnRleHRDb250ZW50ID0gU3RyaW5nLmZyb21DaGFyQ29kZSg2NCArIHgpO1xuICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnbGFiZWxDZWxsJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoeCA9PT0gMCAmJiB5ID4gMCkge1xuICAgICAgICAgIGNlbGwudGV4dENvbnRlbnQgPSB5LnRvU3RyaW5nKCk7XG4gICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKCdsYWJlbENlbGwnKTtcbiAgICAgICAgfSBlbHNlIGlmICh4ID4gMCAmJiB5ID4gMCkgY2VsbC5jbGFzc0xpc3QuYWRkKCdjZWxsJyk7XG5cbiAgICAgICAgY2VsbC5vbmRyYWdvdmVyID0gKGUpID0+IGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY2VsbC5vbmRyb3AgPSAoZSkgPT4ge1xuICAgICAgICAgIGlmIChkaXNwbGF5Qm9hcmQub25DZWxsRHJvcCBpbnN0YW5jZW9mIEZ1bmN0aW9uKVxuICAgICAgICAgICAgZGlzcGxheUJvYXJkLm9uQ2VsbERyb3AoZSwgeCArIDEsIHkgKyAxKTtcbiAgICAgICAgfTtcbiAgICAgICAgY2VsbC5vbmNsaWNrID0gKGUpID0+IHtcbiAgICAgICAgICBpZiAoZGlzcGxheUJvYXJkLm9uQ2VsbENsaWNrIGluc3RhbmNlb2YgRnVuY3Rpb24pXG4gICAgICAgICAgICBkaXNwbGF5Qm9hcmQub25DZWxsQ2xpY2soZSwgeCArIDEsIHkgKyAxKTtcbiAgICAgICAgfTtcbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKGNlbGwpO1xuICAgICAgfVxuICAgIH1cbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgfTtcblxuICBzZXR1cENlbGxzKCk7XG4gIHJldHVybiBkaXNwbGF5Qm9hcmQ7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBQbGF5ZXIoKSB7XG4gIGxldCBndWVzcyA9IHVuZGVmaW5lZDtcbiAgbGV0IGhpc3RvcnkgPSBbXTtcblxuICBsZXQgZ2V0R3Vlc3MgPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgd2hpbGUgKGd1ZXNzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gcmVzb2x2ZSgpLCA1MCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgbGV0IHJldCA9IHsgeDogZ3Vlc3MueCwgeTogZ3Vlc3MueSB9O1xuICAgIGhpc3RvcnkucHVzaChyZXQpO1xuICAgIGd1ZXNzID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiByZXQ7XG4gIH07XG5cbiAgbGV0IHNldEd1ZXNzID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICBndWVzcyA9IHsgeDogeCwgeTogeSB9O1xuICB9O1xuXG4gIGxldCBnZXRIaXN0b3J5ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBbLi4uaGlzdG9yeV07XG4gIH07XG5cbiAgcmV0dXJuIHsgZ2V0R3Vlc3MsIHNldEd1ZXNzLCBnZXRIaXN0b3J5IH07XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTaGlwKGxlbmd0aCkge1xuICBpZiAoIU51bWJlci5pc0ludGVnZXIobGVuZ3RoKSlcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdsZW5ndGggbXVzdCBiZSBhbiBpbnRlZ2VyJyk7XG4gIGVsc2UgaWYgKGxlbmd0aCA8IDApXG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1NoaXAgbGVuZ3RoIGNhbm5vdCBiZSBsZXNzIHRoYW4gemVybycpO1xuICBsZXQgeCA9IDA7XG4gIGxldCB5ID0gMDtcbiAgbGV0IGhvcml6b250YWwgPSBmYWxzZTtcbiAgbGV0IGhpdHMgPSBbXTtcblxuICBsZXQgZ2V0TGVuZ3RoID0gKCkgPT4ge1xuICAgIHJldHVybiBsZW5ndGg7XG4gIH07XG5cbiAgbGV0IHNldE9yaWdpbiA9IChuZXdYLCBuZXdZKSA9PiB7XG4gICAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKG5ld1gpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCd4IG11c3QgYmUgYW4gaW50ZWdlcicpO1xuICAgIGVsc2UgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKG5ld1kpKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigneSBtdXN0IGJlIGFuIGludGVnZXInKTtcblxuICAgIHggPSBuZXdYO1xuICAgIHkgPSBuZXdZO1xuICB9O1xuXG4gIGxldCBnZXRPcmlnaW4gPSAoKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHgsXG4gICAgICB5LFxuICAgIH07XG4gIH07XG5cbiAgbGV0IGlzSG9yaXpvbnRhbCA9ICgpID0+IHtcbiAgICByZXR1cm4gaG9yaXpvbnRhbDtcbiAgfTtcblxuICBsZXQgc2V0SG9yaXpvbnRhbCA9ICh2YWx1ZSkgPT4ge1xuICAgIGhvcml6b250YWwgPSAhIXZhbHVlO1xuICB9O1xuXG4gIGxldCBoaXQgPSAodGFyZ2V0WCwgdGFyZ2V0WSkgPT4ge1xuICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcih0YXJnZXRYKSlcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3RhcmdldFggbXVzdCBiZSBhbiBpbnRlZ2VyJyk7XG4gICAgZWxzZSBpZiAoIU51bWJlci5pc0ludGVnZXIodGFyZ2V0WSkpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0YXJnZXRZIG11c3QgYmUgYW4gaW50ZWdlcicpO1xuXG4gICAgbGV0IHN1Y2Nlc3MgPVxuICAgICAgKGhvcml6b250YWwgJiYgeSA9PT0gdGFyZ2V0WSAmJiB0YXJnZXRYID49IHggJiYgdGFyZ2V0WCA8IHggKyBsZW5ndGgpIHx8XG4gICAgICAoIWhvcml6b250YWwgJiYgeCA9PT0gdGFyZ2V0WCAmJiB0YXJnZXRZID49IHkgJiYgdGFyZ2V0WSA8IHkgKyBsZW5ndGgpO1xuICAgIGlmIChzdWNjZXNzKSBoaXRzLnB1c2goeyB4OiB0YXJnZXRYLCB5OiB0YXJnZXRZIH0pO1xuICAgIHJldHVybiBzdWNjZXNzO1xuICB9O1xuXG4gIGxldCBpc1N1bmsgPSAoKSA9PiB7XG4gICAgaWYgKGhpdHMubGVuZ3RoID09PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIGhpdHMuZXZlcnkoKHYpID0+IHtcbiAgICAgIGlmIChob3Jpem9udGFsKSByZXR1cm4gdi55ID09PSB5ICYmIHYueCA+PSB4ICYmIHYueCA8IHggKyBsZW5ndGg7XG4gICAgICBlbHNlIHJldHVybiB2LnggPT09IHggJiYgdi55ID49IHkgJiYgdi55IDwgeSArIGxlbmd0aDtcbiAgICB9KTtcbiAgfTtcblxuICBsZXQgcmVzZXRIaXRzID0gKCkgPT4gKGhpdHMubGVuZ3RoID0gMCk7XG4gIHJldHVybiB7XG4gICAgZ2V0TGVuZ3RoLFxuICAgIGdldE9yaWdpbixcbiAgICBzZXRPcmlnaW4sXG4gICAgaXNIb3Jpem9udGFsLFxuICAgIHNldEhvcml6b250YWwsXG4gICAgaGl0LFxuICAgIGlzU3VuayxcbiAgICByZXNldEhpdHMsXG4gIH07XG59XG4iLCJleHBvcnQgZGVmYXVsdCAoZnVuY3Rpb24gU2hpcE5hbWVzKCkge1xuICByZXR1cm4ge1xuICAgIENhcnJpZXI6ICdDYXJyaWVyJyxcbiAgICBCYXR0bGVzaGlwOiAnQmF0dGxlc2hpcCcsXG4gICAgRGVzdHJveWVyOiAnRGVzdHJveWVyJyxcbiAgICBTdWJtYXJpbmU6ICdTdWJtYXJpbmUnLFxuICAgIFBhdHJvbEJvYXQ6ICdQYXRyb2xCb2F0JyxcbiAgfTtcbn0pKCk7XG4iLCJpbXBvcnQgU2hpcE5hbWVzIGZyb20gJy4vU2hpcE5hbWVzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2hpcHlhcmQoY29udGFpbmVyKSB7XG4gIGxldCBzaGlweWFyZCA9IHt9O1xuICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdi5jbGFzc0xpc3QuYWRkKCdzaGlweWFyZCcpO1xuICBzaGlweWFyZC5vblNoaXBDbGljayA9IHt9O1xuICBzaGlweWFyZC5vblNoaXBEcmFnU3RhcnQgPSB7fTtcblxuICBmb3IgKGNvbnN0IG5hbWUgaW4gU2hpcE5hbWVzKSB7XG4gICAgbGV0IHNoaXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBzaGlwLmNsYXNzTGlzdC5hZGQobmFtZSk7XG4gICAgc2hpcC5pZCA9IG5hbWU7XG4gICAgc2hpcC5jbGFzc0xpc3QuYWRkKCdzaGlwJyk7XG4gICAgc2hpcC5jbGFzc0xpc3QuYWRkKCd2ZXJ0aWNhbFNoaXAnKTtcbiAgICBzaGlwLnN0eWxlLmdyaWRBcmVhID0gbmFtZTtcbiAgICBzaGlwLmRyYWdnYWJsZSA9IHRydWU7XG4gICAgc2hpcC5vbmRyYWdzdGFydCA9IChlKSA9PiB7XG4gICAgICBpZiAoc2hpcHlhcmQub25TaGlwRHJhZ1N0YXJ0IGluc3RhbmNlb2YgRnVuY3Rpb24pXG4gICAgICAgIHNoaXB5YXJkLm9uU2hpcERyYWdTdGFydChlLCBuYW1lKTtcbiAgICB9O1xuICAgIHNoaXAub25jbGljayA9IChlKSA9PiB7XG4gICAgICBpZiAoc2hpcHlhcmQub25TaGlwQ2xpY2sgaW5zdGFuY2VvZiBGdW5jdGlvbilcbiAgICAgICAgc2hpcHlhcmQub25TaGlwQ2xpY2soZSwgbmFtZSk7XG4gICAgfTtcbiAgICBzaGlwLnRleHRDb250ZW50ID0gbmFtZTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoc2hpcCk7XG4gIH1cbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRpdik7XG4gIHJldHVybiBzaGlweWFyZDtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IEJhdHRsZXNoaXAgZnJvbSAnLi9CYXR0bGVzaGlwJztcbmltcG9ydCBEaXNwbGF5IGZyb20gJy4vRGlzcGxheSc7XG5pbXBvcnQgUGxheWVyIGZyb20gJy4vUGxheWVyJztcblxubGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWluZXInKTtcbi8vIGxldCBvcHBvbmVudCA9IG5ldyBEaXNwbGF5Qm9hcmQoY29udGFpbmVyKTtcbi8vIGxldCBib2FyZCA9IEJvYXJkKDEwKTtcbi8vIGxldCBwbGF5ZXIgPSBuZXcgRGlzcGxheUJvYXJkKGNvbnRhaW5lciwgYm9hcmQpO1xuLy8gbGV0IHNoaXB5YXJkID0gbmV3IFNoaXB5YXJkRGlzcGxheShjb250YWluZXIsIGJvYXJkKTtcbmxldCBwbGF5ZXIgPSBQbGF5ZXIoKTtcbmxldCBvcHBvbmVudCA9IFBsYXllcigpO1xubGV0IGJhdHRsZXNoaXAgPSBCYXR0bGVzaGlwKHBsYXllciwgb3Bwb25lbnQpO1xubGV0IGRpc3BsYXkgPSBEaXNwbGF5KGJhdHRsZXNoaXAsIHBsYXllciwgb3Bwb25lbnQsIGNvbnRhaW5lcik7XG5iYXR0bGVzaGlwLm9uRHJhdyA9ICgpID0+IHtcbiAgZGlzcGxheS5kcmF3KCk7XG59O1xuXG4vLyBsZXQgZmluaXNoID0gZmFsc2U7XG4vLyBsZXQgZ2V0R3Vlc3MgPSBhc3luYyBmdW5jdGlvbiAoaSkge1xuLy8gICB3aGlsZSAoIWZpbmlzaCkge1xuLy8gICAgIGkgPSBpICsgMTtcbi8vICAgICBjb25zb2xlLmxvZyhpKTtcbi8vICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuLy8gICAgICAgc2V0VGltZW91dCgoKSA9PiByZXNvbHZlKGkpLCAxMDAwKTtcbi8vICAgICB9KTtcbi8vICAgfVxuLy8gICByZXR1cm4gaTtcbi8vIH07XG5cbi8vIGxldCBjb3VudCA9IGZ1bmN0aW9uIChpKSB7XG4vLyAgIGNvbnNvbGUubG9nKGkpO1xuLy8gICBpZiAoIWZpbmlzaCkgc2V0VGltZW91dChjb3VudCwgNTAwLCBpICsgMSk7XG4vLyB9O1xuLy8gbGV0IHN0YXJ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXJ0Jyk7XG4vLyBzdGFydC5vbmNsaWNrID0gYXN5bmMgZnVuY3Rpb24gKCkge1xuLy8gICBsZXQgYSA9IGF3YWl0IGdldEd1ZXNzKDEpO1xuLy8gICBjb25zb2xlLmxvZyhgRmluaXNoOiAke2F9YCk7XG4vLyB9O1xuLy8gbGV0IHN0b3AgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RvcCcpO1xuLy8gc3RvcC5vbmNsaWNrID0gKCkgPT4ge1xuLy8gICBmaW5pc2ggPSB0cnVlO1xuLy8gfTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==