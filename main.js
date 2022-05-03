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
  let p1Board = (0,_Board__WEBPACK_IMPORTED_MODULE_0__["default"])(10);
  let p2Board = (0,_Board__WEBPACK_IMPORTED_MODULE_0__["default"])(10);

  let placeShip = function (name, x, y, horizontal, isPlayer1) {
    if (isPlayer1) p1Board.placeShip(name, x, y, horizontal);
    else p2Board.placeShip(name, x, y);
  };

  let getShipInfo = function (name, isPlayer1) {
    return isPlayer1 ? p1Board.getShipInfo(name) : p2Board.getShipInfo(name);
  };

  let start = function () {};

  return { placeShip, getShipInfo };
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
/* harmony import */ var _Shipyard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Shipyard */ "./src/Shipyard.js");



function Display(battleship, container) {
  let opponent = (0,_DisplayBoard__WEBPACK_IMPORTED_MODULE_0__["default"])(container);

  let player = (0,_DisplayBoard__WEBPACK_IMPORTED_MODULE_0__["default"])(container);
  player.onCellDrop = (e, x, y) => {
    e.preventDefault();
    let info = JSON.parse(e.dataTransfer.getData('text'));
    let origin = player.cellFromPoint(
      e.x - e.offsetX - info.offsetX + 25,
      e.y - e.offsetY - info.offsetY + 25
    );
    battleship.placeShip(info.name, origin.x, origin.y, info.horizontal, true);
    player.drawShip(info.name, battleship.getShipInfo(info.name, true));
  };
  player.onCellClick = (e, x, y) => {};

  let shipyard = (0,_Shipyard__WEBPACK_IMPORTED_MODULE_1__["default"])(container);
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
    player.drawShip(name, battleship.getShipInfo(name, true));
  };
  return {};
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
/* harmony import */ var _Board__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Board */ "./src/Board.js");
/* harmony import */ var _Display__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Display */ "./src/Display.js");
/* harmony import */ var _DisplayBoard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DisplayBoard */ "./src/DisplayBoard.js");
/* harmony import */ var _Shipyard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Shipyard */ "./src/Shipyard.js");






let container = document.getElementById('container');
// let opponent = new DisplayBoard(container);
// let board = Board(10);
// let player = new DisplayBoard(container, board);
// let shipyard = new ShipyardDisplay(container, board);
let display = (0,_Display__WEBPACK_IMPORTED_MODULE_2__["default"])(new _Battleship__WEBPACK_IMPORTED_MODULE_0__["default"](), container);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0EsNkJBQTZCLHdCQUF3QjtBQUNyRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUN0RUEsaUVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsR0FBRyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDUitCOztBQUVyQjtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUJBQXFCLGtEQUFTO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztVQzlCQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7OztBQ05zQztBQUNWO0FBQ0k7QUFDVTtBQUNEOztBQUV6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxvREFBTyxLQUFLLG1EQUFVIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9CYXR0bGVzaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvQm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9EaXNwbGF5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvRGlzcGxheUJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvU2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL1NoaXBOYW1lcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL1NoaXB5YXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCb2FyZCBmcm9tICcuL0JvYXJkJztcbmltcG9ydCBTaGlwTmFtZXMgZnJvbSAnLi9TaGlwTmFtZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCYXR0bGVzaGlwKHBsYXllcjEsIHBsYXllcjIpIHtcbiAgbGV0IHAxQm9hcmQgPSBCb2FyZCgxMCk7XG4gIGxldCBwMkJvYXJkID0gQm9hcmQoMTApO1xuXG4gIGxldCBwbGFjZVNoaXAgPSBmdW5jdGlvbiAobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCwgaXNQbGF5ZXIxKSB7XG4gICAgaWYgKGlzUGxheWVyMSkgcDFCb2FyZC5wbGFjZVNoaXAobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCk7XG4gICAgZWxzZSBwMkJvYXJkLnBsYWNlU2hpcChuYW1lLCB4LCB5KTtcbiAgfTtcblxuICBsZXQgZ2V0U2hpcEluZm8gPSBmdW5jdGlvbiAobmFtZSwgaXNQbGF5ZXIxKSB7XG4gICAgcmV0dXJuIGlzUGxheWVyMSA/IHAxQm9hcmQuZ2V0U2hpcEluZm8obmFtZSkgOiBwMkJvYXJkLmdldFNoaXBJbmZvKG5hbWUpO1xuICB9O1xuXG4gIGxldCBzdGFydCA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gIHJldHVybiB7IHBsYWNlU2hpcCwgZ2V0U2hpcEluZm8gfTtcbn1cbiIsImltcG9ydCBTaGlwIGZyb20gJy4vU2hpcCc7XG5pbXBvcnQgU2hpcE5hbWVzIGZyb20gJy4vU2hpcE5hbWVzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQm9hcmQoc2l6ZSkge1xuICBsZXQgc2hpcHMgPSB7fTtcbiAgc2hpcHNbU2hpcE5hbWVzLkNhcnJpZXJdID0gU2hpcCg1KTtcbiAgc2hpcHNbU2hpcE5hbWVzLkJhdHRsZXNoaXBdID0gU2hpcCg0KTtcbiAgc2hpcHNbU2hpcE5hbWVzLkRlc3Ryb3llcl0gPSBTaGlwKDMpO1xuICBzaGlwc1tTaGlwTmFtZXMuU3VibWFyaW5lXSA9IFNoaXAoMyk7XG4gIHNoaXBzW1NoaXBOYW1lcy5QYXRyb2xCb2F0XSA9IFNoaXAoMik7XG4gIGxldCBwbGFjZWRTaGlwcyA9IFtdO1xuICBsZXQgdmFsaWRhdGVTaGlwSW5mbyA9IGZ1bmN0aW9uIChuYW1lLCB4LCB5LCBob3Jpem9udGFsKSB7XG4gICAgaWYgKHNoaXBzW25hbWVdID09PSB1bmRlZmluZWQpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yOiBuYW1lIG11c3QgYmUgYSB2YWxpZCBzaGlwIG5hbWUnKTtcbiAgICBpZiAoeCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCd4IG11c3QgYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHplcm8nKTtcbiAgICBpZiAoeSA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCd5IG11c3QgYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHplcm8nKTtcbiAgICBpZiAoaG9yaXpvbnRhbCAmJiB4ICsgc2hpcHNbbmFtZV0uZ2V0TGVuZ3RoKCkgLSAxID49IHNpemUpXG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcbiAgICAgICAgYHggbXVzdCBiZSBsZXNzIHRoYW4gdGhlIHNpemUgb2YgdGhlIGJvYXJkICgke3NpemV9KWBcbiAgICAgICk7XG4gICAgaWYgKCFob3Jpem9udGFsICYmIHkgKyBzaGlwc1tuYW1lXS5nZXRMZW5ndGgoKSAtIDEgPj0gc2l6ZSlcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFxuICAgICAgICBgeSBtdXN0IGJlIGxlc3MgdGhhbiB0aGUgc2l6ZSBvZiB0aGUgYm9hcmQgKCR7c2l6ZX0pYFxuICAgICAgKTtcbiAgfTtcblxuICBsZXQgaXNWYWxpZFNoaXBQbGFjZW1lbnQgPSBmdW5jdGlvbiAobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCkge1xuICAgIGlmIChzaGlwc1tuYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvcjogbmFtZSBtdXN0IGJlIGEgdmFsaWQgc2hpcCBuYW1lJyk7XG4gICAgbGV0IGxlZnQgPSB4O1xuICAgIGxldCB0b3AgPSB5O1xuICAgIGxldCByaWdodCA9IGhvcml6b250YWwgPyBsZWZ0ICsgc2hpcHNbbmFtZV0uZ2V0TGVuZ3RoKCkgLSAxIDogbGVmdDtcbiAgICBsZXQgYm90dG9tID0gaG9yaXpvbnRhbCA/IHRvcCA6IHRvcCArIHNoaXBzW25hbWVdLmdldExlbmd0aCgpIC0gMTtcbiAgICByZXR1cm4gIXBsYWNlZFNoaXBzLnNvbWUoKHZhbCkgPT4ge1xuICAgICAgaWYgKHZhbCAhPT0gbmFtZSkge1xuICAgICAgICBsZXQgbCA9IHNoaXBzW3ZhbF0uZ2V0T3JpZ2luKCkueDtcbiAgICAgICAgbGV0IHQgPSBzaGlwc1t2YWxdLmdldE9yaWdpbigpLnk7XG4gICAgICAgIGxldCByID0gc2hpcHNbdmFsXS5pc0hvcml6b250YWwoKSA/IGwgKyBzaGlwc1t2YWxdLmdldExlbmd0aCgpIC0gMSA6IGw7XG4gICAgICAgIGxldCBiID0gc2hpcHNbdmFsXS5pc0hvcml6b250YWwoKSA/IHQgOiB0ICsgc2hpcHNbdmFsXS5nZXRMZW5ndGgoKSAtIDE7XG4gICAgICAgIC8vIHNoaXBzIGNvbGxpZGVcbiAgICAgICAgaWYgKFxuICAgICAgICAgICgobGVmdCA+PSBsICYmIGxlZnQgPD0gcikgfHwgKHJpZ2h0ID49IGwgJiYgcmlnaHQgPD0gcikpICYmXG4gICAgICAgICAgKCh0b3AgPj0gdCAmJiB0b3AgPD0gYikgfHwgKGJvdHRvbSA+PSB0ICYmIGJvdHRvbSA8PSBiKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBsZXQgcGxhY2VTaGlwID0gZnVuY3Rpb24gKG5hbWUsIHgsIHksIGhvcml6b250YWwpIHtcbiAgICB2YWxpZGF0ZVNoaXBJbmZvKG5hbWUsIHgsIHksIGhvcml6b250YWwpO1xuICAgIGlmICghaXNWYWxpZFNoaXBQbGFjZW1lbnQobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCkpIHJldHVybiBmYWxzZTtcbiAgICBzaGlwc1tuYW1lXS5zZXRPcmlnaW4oeCwgeSk7XG4gICAgc2hpcHNbbmFtZV0uc2V0SG9yaXpvbnRhbChob3Jpem9udGFsKTtcbiAgICBpZiAoIXBsYWNlZFNoaXBzLmluY2x1ZGVzKG5hbWUpKSBwbGFjZWRTaGlwcy5wdXNoKG5hbWUpO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIGxldCByZW1vdmVTaGlwID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBpZiAoc2hpcHNbbmFtZV0gPT09IHVuZGVmaW5lZClcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3I6IG5hbWUgbXVzdCBiZSBhIHZhbGlkIHNoaXAgbmFtZScpO1xuICAgIHBsYWNlZFNoaXBzID0gcGxhY2VkU2hpcHMuZmlsdGVyKCh2KSA9PiB2ICE9PSBuYW1lKTtcbiAgICBzaGlwc1tuYW1lXS5yZXNldEhpdHMoKTtcbiAgfTtcblxuICBsZXQgaGl0ID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gc2hpcHMpIHtcbiAgICAgIGlmIChwbGFjZWRTaGlwcy5pbmNsdWRlcyhuYW1lKSAmJiBzaGlwc1tuYW1lXS5oaXQoeCwgeSkpIHJldHVybiBuYW1lO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgbGV0IGlzU3VuayA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgaWYgKHNoaXBzW25hbWVdID09PSB1bmRlZmluZWQpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yOiBuYW1lIG11c3QgYmUgYSB2YWxpZCBzaGlwIG5hbWUnKTtcbiAgICByZXR1cm4gc2hpcHNbbmFtZV0uaXNTdW5rKCk7XG4gIH07XG5cbiAgbGV0IGdldFNoaXBJbmZvID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBpZiAoc2hpcHNbbmFtZV0gPT09IHVuZGVmaW5lZClcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3I6IG5hbWUgbXVzdCBiZSBhIHZhbGlkIHNoaXAgbmFtZScpO1xuICAgIGlmICghcGxhY2VkU2hpcHMuaW5jbHVkZXMobmFtZSkpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9yaWdpbjogc2hpcHNbbmFtZV0uZ2V0T3JpZ2luKCksXG4gICAgICBob3Jpem9udGFsOiBzaGlwc1tuYW1lXS5pc0hvcml6b250YWwoKSxcbiAgICAgIHN1bms6IHNoaXBzW25hbWVdLmlzU3VuaygpLFxuICAgICAgbGVuZ3RoOiBzaGlwc1tuYW1lXS5nZXRMZW5ndGgoKSxcbiAgICB9O1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgcGxhY2VTaGlwLFxuICAgIHJlbW92ZVNoaXAsXG4gICAgaGl0LFxuICAgIGlzU3VuayxcbiAgICBnZXRTaGlwSW5mbyxcbiAgfTtcbn1cbiIsImltcG9ydCBEaXNwbGF5Qm9hcmQgZnJvbSAnLi9EaXNwbGF5Qm9hcmQnO1xuaW1wb3J0IFNoaXB5YXJkIGZyb20gJy4vU2hpcHlhcmQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBEaXNwbGF5KGJhdHRsZXNoaXAsIGNvbnRhaW5lcikge1xuICBsZXQgb3Bwb25lbnQgPSBEaXNwbGF5Qm9hcmQoY29udGFpbmVyKTtcblxuICBsZXQgcGxheWVyID0gRGlzcGxheUJvYXJkKGNvbnRhaW5lcik7XG4gIHBsYXllci5vbkNlbGxEcm9wID0gKGUsIHgsIHkpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgbGV0IGluZm8gPSBKU09OLnBhcnNlKGUuZGF0YVRyYW5zZmVyLmdldERhdGEoJ3RleHQnKSk7XG4gICAgbGV0IG9yaWdpbiA9IHBsYXllci5jZWxsRnJvbVBvaW50KFxuICAgICAgZS54IC0gZS5vZmZzZXRYIC0gaW5mby5vZmZzZXRYICsgMjUsXG4gICAgICBlLnkgLSBlLm9mZnNldFkgLSBpbmZvLm9mZnNldFkgKyAyNVxuICAgICk7XG4gICAgYmF0dGxlc2hpcC5wbGFjZVNoaXAoaW5mby5uYW1lLCBvcmlnaW4ueCwgb3JpZ2luLnksIGluZm8uaG9yaXpvbnRhbCwgdHJ1ZSk7XG4gICAgcGxheWVyLmRyYXdTaGlwKGluZm8ubmFtZSwgYmF0dGxlc2hpcC5nZXRTaGlwSW5mbyhpbmZvLm5hbWUsIHRydWUpKTtcbiAgfTtcbiAgcGxheWVyLm9uQ2VsbENsaWNrID0gKGUsIHgsIHkpID0+IHt9O1xuXG4gIGxldCBzaGlweWFyZCA9IFNoaXB5YXJkKGNvbnRhaW5lcik7XG4gIHNoaXB5YXJkLm9uU2hpcERyYWdTdGFydCA9IChlLCBuYW1lKSA9PiB7XG4gICAgbGV0IGluZm8gPSBiYXR0bGVzaGlwLmdldFNoaXBJbmZvKG5hbWUsIHRydWUpO1xuICAgIGxldCBob3Jpem9udGFsID0gaW5mbyA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBpbmZvLmhvcml6b250YWw7XG4gICAgZS5kYXRhVHJhbnNmZXIuc2V0RGF0YShcbiAgICAgICd0ZXh0JyxcbiAgICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgbmFtZTogZS50YXJnZXQuaWQsXG4gICAgICAgIG9mZnNldFg6IGUub2Zmc2V0WCxcbiAgICAgICAgb2Zmc2V0WTogZS5vZmZzZXRZLFxuICAgICAgICBob3Jpem9udGFsOiBob3Jpem9udGFsLFxuICAgICAgfSlcbiAgICApO1xuICB9O1xuICBzaGlweWFyZC5vblNoaXBDbGljayA9IChlLCBuYW1lKSA9PiB7XG4gICAgbGV0IGluZm8gPSBiYXR0bGVzaGlwLmdldFNoaXBJbmZvKG5hbWUsIHRydWUpO1xuICAgIGlmIChpbmZvID09PSB1bmRlZmluZWQpIHJldHVybjtcbiAgICBiYXR0bGVzaGlwLnBsYWNlU2hpcChcbiAgICAgIG5hbWUsXG4gICAgICBpbmZvLm9yaWdpbi54LFxuICAgICAgaW5mby5vcmlnaW4ueSxcbiAgICAgICFpbmZvLmhvcml6b250YWwsXG4gICAgICB0cnVlXG4gICAgKTtcbiAgICBwbGF5ZXIuZHJhd1NoaXAobmFtZSwgYmF0dGxlc2hpcC5nZXRTaGlwSW5mbyhuYW1lLCB0cnVlKSk7XG4gIH07XG4gIHJldHVybiB7fTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIERpc3BsYXlCb2FyZChjb250YWluZXIpIHtcbiAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBkaXYuY2xhc3NMaXN0LmFkZCgnYm9hcmQnKTtcblxuICBsZXQgZGlzcGxheUJvYXJkID0ge307XG4gIGRpc3BsYXlCb2FyZC5vbkNlbGxEcm9wID0ge307XG4gIGRpc3BsYXlCb2FyZC5vbkNlbGxDbGljayA9IHt9O1xuICBkaXNwbGF5Qm9hcmQuY2VsbEZyb21Qb2ludCA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgbGV0IGNlbGwgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KHgsIHkpO1xuICAgIGlmIChjZWxsLmNsYXNzTGlzdC5jb250YWlucygnY2VsbCcpICYmIGRpdi5jb250YWlucyhjZWxsKSlcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKGNlbGwuaWQpO1xuICAgIGVsc2UgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfTtcblxuICBkaXNwbGF5Qm9hcmQuZHJhd1NoaXAgPSBmdW5jdGlvbiAobmFtZSwgaW5mbykge1xuICAgIGlmIChpbmZvICE9IHVuZGVmaW5lZCkge1xuICAgICAgbGV0IHNoaXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChuYW1lKTtcbiAgICAgIGxldCByaWdodCA9IGluZm8ub3JpZ2luLnggKyAzO1xuICAgICAgbGV0IGJvdHRvbSA9IGluZm8ub3JpZ2luLnkgKyAzO1xuICAgICAgaWYgKGluZm8uaG9yaXpvbnRhbCkge1xuICAgICAgICByaWdodCArPSBpbmZvLmxlbmd0aCAtIDE7XG4gICAgICAgIHNoaXAuY2xhc3NMaXN0LnJlbW92ZSgndmVydGljYWxTaGlwJyk7XG4gICAgICAgIHNoaXAuY2xhc3NMaXN0LmFkZCgnaG9yaXpvbnRhbFNoaXAnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJvdHRvbSArPSBpbmZvLmxlbmd0aCAtIDE7XG4gICAgICAgIHNoaXAuY2xhc3NMaXN0LnJlbW92ZSgnaG9yaXpvbnRhbFNoaXAnKTtcbiAgICAgICAgc2hpcC5jbGFzc0xpc3QuYWRkKCd2ZXJ0aWNhbFNoaXAnKTtcbiAgICAgIH1cbiAgICAgIHNoaXAuc3R5bGUuZ3JpZEFyZWEgPSBgXG4gICAgICAgICAgICAke2luZm8ub3JpZ2luLnkgKyAyfSAvXG4gICAgICAgICAgICAke2luZm8ub3JpZ2luLnggKyAyfSAvXG4gICAgICAgICAgICAke2JvdHRvbX0gL1xuICAgICAgICAgICAgJHtyaWdodH1gO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKHNoaXApO1xuICAgIH1cbiAgfTtcblxuICBsZXQgc2V0dXBDZWxscyA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8IDExOyB5KyspIHtcbiAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgMTE7IHgrKykge1xuICAgICAgICBsZXQgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBjZWxsLmlkID0gSlNPTi5zdHJpbmdpZnkoeyB4OiB4IC0gMSwgeTogeSAtIDEgfSk7XG4gICAgICAgIGNlbGwuc3R5bGUuZ3JpZEFyZWEgPSBgJHt5ICsgMX0gLyAke3ggKyAxfSAvICR7eSArIDJ9IC8gJHt4ICsgMn1gO1xuICAgICAgICBpZiAoeSA9PT0gMCAmJiB4ID4gMCkge1xuICAgICAgICAgIGNlbGwudGV4dENvbnRlbnQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDY0ICsgeCk7XG4gICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKCdsYWJlbENlbGwnKTtcbiAgICAgICAgfSBlbHNlIGlmICh4ID09PSAwICYmIHkgPiAwKSB7XG4gICAgICAgICAgY2VsbC50ZXh0Q29udGVudCA9IHkudG9TdHJpbmcoKTtcbiAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ2xhYmVsQ2VsbCcpO1xuICAgICAgICB9IGVsc2UgaWYgKHggPiAwICYmIHkgPiAwKSBjZWxsLmNsYXNzTGlzdC5hZGQoJ2NlbGwnKTtcblxuICAgICAgICBjZWxsLm9uZHJhZ292ZXIgPSAoZSkgPT4gZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjZWxsLm9uZHJvcCA9IChlKSA9PiB7XG4gICAgICAgICAgaWYgKGRpc3BsYXlCb2FyZC5vbkNlbGxEcm9wIGluc3RhbmNlb2YgRnVuY3Rpb24pXG4gICAgICAgICAgICBkaXNwbGF5Qm9hcmQub25DZWxsRHJvcChlLCB4ICsgMSwgeSArIDEpO1xuICAgICAgICB9O1xuICAgICAgICBjZWxsLm9uY2xpY2sgPSAoZSkgPT4ge1xuICAgICAgICAgIGlmIChkaXNwbGF5Qm9hcmQub25DZWxsQ2xpY2sgaW5zdGFuY2VvZiBGdW5jdGlvbilcbiAgICAgICAgICAgIGRpc3BsYXlCb2FyZC5vbkNlbGxDbGljayhlLCB4ICsgMSwgeSArIDEpO1xuICAgICAgICB9O1xuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoY2VsbCk7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkaXYpO1xuICB9O1xuXG4gIHNldHVwQ2VsbHMoKTtcbiAgcmV0dXJuIGRpc3BsYXlCb2FyZDtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNoaXAobGVuZ3RoKSB7XG4gIGlmICghTnVtYmVyLmlzSW50ZWdlcihsZW5ndGgpKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2xlbmd0aCBtdXN0IGJlIGFuIGludGVnZXInKTtcbiAgZWxzZSBpZiAobGVuZ3RoIDwgMClcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignU2hpcCBsZW5ndGggY2Fubm90IGJlIGxlc3MgdGhhbiB6ZXJvJyk7XG4gIGxldCB4ID0gMDtcbiAgbGV0IHkgPSAwO1xuICBsZXQgaG9yaXpvbnRhbCA9IGZhbHNlO1xuICBsZXQgaGl0cyA9IFtdO1xuXG4gIGxldCBnZXRMZW5ndGggPSAoKSA9PiB7XG4gICAgcmV0dXJuIGxlbmd0aDtcbiAgfTtcblxuICBsZXQgc2V0T3JpZ2luID0gKG5ld1gsIG5ld1kpID0+IHtcbiAgICBpZiAoIU51bWJlci5pc0ludGVnZXIobmV3WCkpIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ggbXVzdCBiZSBhbiBpbnRlZ2VyJyk7XG4gICAgZWxzZSBpZiAoIU51bWJlci5pc0ludGVnZXIobmV3WSkpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd5IG11c3QgYmUgYW4gaW50ZWdlcicpO1xuXG4gICAgeCA9IG5ld1g7XG4gICAgeSA9IG5ld1k7XG4gIH07XG5cbiAgbGV0IGdldE9yaWdpbiA9ICgpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgeCxcbiAgICAgIHksXG4gICAgfTtcbiAgfTtcblxuICBsZXQgaXNIb3Jpem9udGFsID0gKCkgPT4ge1xuICAgIHJldHVybiBob3Jpem9udGFsO1xuICB9O1xuXG4gIGxldCBzZXRIb3Jpem9udGFsID0gKHZhbHVlKSA9PiB7XG4gICAgaG9yaXpvbnRhbCA9ICEhdmFsdWU7XG4gIH07XG5cbiAgbGV0IGhpdCA9ICh0YXJnZXRYLCB0YXJnZXRZKSA9PiB7XG4gICAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKHRhcmdldFgpKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndGFyZ2V0WCBtdXN0IGJlIGFuIGludGVnZXInKTtcbiAgICBlbHNlIGlmICghTnVtYmVyLmlzSW50ZWdlcih0YXJnZXRZKSlcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3RhcmdldFkgbXVzdCBiZSBhbiBpbnRlZ2VyJyk7XG5cbiAgICBsZXQgc3VjY2VzcyA9XG4gICAgICAoaG9yaXpvbnRhbCAmJiB5ID09PSB0YXJnZXRZICYmIHRhcmdldFggPj0geCAmJiB0YXJnZXRYIDwgeCArIGxlbmd0aCkgfHxcbiAgICAgICghaG9yaXpvbnRhbCAmJiB4ID09PSB0YXJnZXRYICYmIHRhcmdldFkgPj0geSAmJiB0YXJnZXRZIDwgeSArIGxlbmd0aCk7XG4gICAgaWYgKHN1Y2Nlc3MpIGhpdHMucHVzaCh7IHg6IHRhcmdldFgsIHk6IHRhcmdldFkgfSk7XG4gICAgcmV0dXJuIHN1Y2Nlc3M7XG4gIH07XG5cbiAgbGV0IGlzU3VuayA9ICgpID0+IHtcbiAgICBpZiAoaGl0cy5sZW5ndGggPT09IDApIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gaGl0cy5ldmVyeSgodikgPT4ge1xuICAgICAgaWYgKGhvcml6b250YWwpIHJldHVybiB2LnkgPT09IHkgJiYgdi54ID49IHggJiYgdi54IDwgeCArIGxlbmd0aDtcbiAgICAgIGVsc2UgcmV0dXJuIHYueCA9PT0geCAmJiB2LnkgPj0geSAmJiB2LnkgPCB5ICsgbGVuZ3RoO1xuICAgIH0pO1xuICB9O1xuXG4gIGxldCByZXNldEhpdHMgPSAoKSA9PiAoaGl0cy5sZW5ndGggPSAwKTtcbiAgcmV0dXJuIHtcbiAgICBnZXRMZW5ndGgsXG4gICAgZ2V0T3JpZ2luLFxuICAgIHNldE9yaWdpbixcbiAgICBpc0hvcml6b250YWwsXG4gICAgc2V0SG9yaXpvbnRhbCxcbiAgICBoaXQsXG4gICAgaXNTdW5rLFxuICAgIHJlc2V0SGl0cyxcbiAgfTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IChmdW5jdGlvbiBTaGlwTmFtZXMoKSB7XG4gIHJldHVybiB7XG4gICAgQ2FycmllcjogJ0NhcnJpZXInLFxuICAgIEJhdHRsZXNoaXA6ICdCYXR0bGVzaGlwJyxcbiAgICBEZXN0cm95ZXI6ICdEZXN0cm95ZXInLFxuICAgIFN1Ym1hcmluZTogJ1N1Ym1hcmluZScsXG4gICAgUGF0cm9sQm9hdDogJ1BhdHJvbEJvYXQnLFxuICB9O1xufSkoKTtcbiIsImltcG9ydCBTaGlwTmFtZXMgZnJvbSAnLi9TaGlwTmFtZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTaGlweWFyZChjb250YWluZXIpIHtcbiAgbGV0IHNoaXB5YXJkID0ge307XG4gIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGl2LmNsYXNzTGlzdC5hZGQoJ3NoaXB5YXJkJyk7XG4gIHNoaXB5YXJkLm9uU2hpcENsaWNrID0ge307XG4gIHNoaXB5YXJkLm9uU2hpcERyYWdTdGFydCA9IHt9O1xuXG4gIGZvciAoY29uc3QgbmFtZSBpbiBTaGlwTmFtZXMpIHtcbiAgICBsZXQgc2hpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHNoaXAuY2xhc3NMaXN0LmFkZChuYW1lKTtcbiAgICBzaGlwLmlkID0gbmFtZTtcbiAgICBzaGlwLmNsYXNzTGlzdC5hZGQoJ3NoaXAnKTtcbiAgICBzaGlwLmNsYXNzTGlzdC5hZGQoJ3ZlcnRpY2FsU2hpcCcpO1xuICAgIHNoaXAuc3R5bGUuZ3JpZEFyZWEgPSBuYW1lO1xuICAgIHNoaXAuZHJhZ2dhYmxlID0gdHJ1ZTtcbiAgICBzaGlwLm9uZHJhZ3N0YXJ0ID0gKGUpID0+IHtcbiAgICAgIGlmIChzaGlweWFyZC5vblNoaXBEcmFnU3RhcnQgaW5zdGFuY2VvZiBGdW5jdGlvbilcbiAgICAgICAgc2hpcHlhcmQub25TaGlwRHJhZ1N0YXJ0KGUsIG5hbWUpO1xuICAgIH07XG4gICAgc2hpcC5vbmNsaWNrID0gKGUpID0+IHtcbiAgICAgIGlmIChzaGlweWFyZC5vblNoaXBDbGljayBpbnN0YW5jZW9mIEZ1bmN0aW9uKVxuICAgICAgICBzaGlweWFyZC5vblNoaXBDbGljayhlLCBuYW1lKTtcbiAgICB9O1xuICAgIHNoaXAudGV4dENvbnRlbnQgPSBuYW1lO1xuICAgIGRpdi5hcHBlbmRDaGlsZChzaGlwKTtcbiAgfVxuICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgcmV0dXJuIHNoaXB5YXJkO1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgQmF0dGxlc2hpcCBmcm9tICcuL0JhdHRsZXNoaXAnO1xuaW1wb3J0IEJvYXJkIGZyb20gJy4vQm9hcmQnO1xuaW1wb3J0IERpc3BsYXkgZnJvbSAnLi9EaXNwbGF5JztcbmltcG9ydCBEaXNwbGF5Qm9hcmQgZnJvbSAnLi9EaXNwbGF5Qm9hcmQnO1xuaW1wb3J0IFNoaXB5YXJkRGlzcGxheSBmcm9tICcuL1NoaXB5YXJkJztcblxubGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWluZXInKTtcbi8vIGxldCBvcHBvbmVudCA9IG5ldyBEaXNwbGF5Qm9hcmQoY29udGFpbmVyKTtcbi8vIGxldCBib2FyZCA9IEJvYXJkKDEwKTtcbi8vIGxldCBwbGF5ZXIgPSBuZXcgRGlzcGxheUJvYXJkKGNvbnRhaW5lciwgYm9hcmQpO1xuLy8gbGV0IHNoaXB5YXJkID0gbmV3IFNoaXB5YXJkRGlzcGxheShjb250YWluZXIsIGJvYXJkKTtcbmxldCBkaXNwbGF5ID0gRGlzcGxheShuZXcgQmF0dGxlc2hpcCgpLCBjb250YWluZXIpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9