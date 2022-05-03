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

  let placeShip = function (name, x, y, isPlayer1) {
    if (isPlayer1) p1Board.placeShip(name, x, y);
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
    battleship.placeShip(info.name, origin.x, origin.y, true);
    player.drawShip(info.name, battleship.getShipInfo(info.name, true));
  };
  player.onCellClick = (e, x, y) => {};
  let shipyard = (0,_Shipyard__WEBPACK_IMPORTED_MODULE_1__["default"])(container);
  shipyard.onShipDragStart = (e, name) => {
    e.dataTransfer.setData(
      'text',
      JSON.stringify({
        name: e.target.id,
        offsetX: e.offsetX,
        offsetY: e.offsetY,
      })
    );
  };
  shipyard.onShipClick = (e, name) => {
    // let info = board.getShipInfo(name);
    // if (info === undefined) return;
    // console.log(info);
    // board.placeShip(name, info.origin.x, info.origin.y, !info.horizontal);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDdEVBLGlFQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLEdBQUcsRUFBQzs7Ozs7Ozs7Ozs7Ozs7OztBQ1IrQjs7QUFFckI7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFCQUFxQixrREFBUztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7VUM5QkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOc0M7QUFDVjtBQUNJO0FBQ1U7QUFDRDs7QUFFekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsb0RBQU8sS0FBSyxtREFBVSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvQmF0dGxlc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL0JvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvRGlzcGxheS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL0Rpc3BsYXlCb2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL1NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9TaGlwTmFtZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9TaGlweWFyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQm9hcmQgZnJvbSAnLi9Cb2FyZCc7XG5pbXBvcnQgU2hpcE5hbWVzIGZyb20gJy4vU2hpcE5hbWVzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQmF0dGxlc2hpcChwbGF5ZXIxLCBwbGF5ZXIyKSB7XG4gIGxldCBwMUJvYXJkID0gQm9hcmQoMTApO1xuICBsZXQgcDJCb2FyZCA9IEJvYXJkKDEwKTtcblxuICBsZXQgcGxhY2VTaGlwID0gZnVuY3Rpb24gKG5hbWUsIHgsIHksIGlzUGxheWVyMSkge1xuICAgIGlmIChpc1BsYXllcjEpIHAxQm9hcmQucGxhY2VTaGlwKG5hbWUsIHgsIHkpO1xuICAgIGVsc2UgcDJCb2FyZC5wbGFjZVNoaXAobmFtZSwgeCwgeSk7XG4gIH07XG5cbiAgbGV0IGdldFNoaXBJbmZvID0gZnVuY3Rpb24gKG5hbWUsIGlzUGxheWVyMSkge1xuICAgIHJldHVybiBpc1BsYXllcjEgPyBwMUJvYXJkLmdldFNoaXBJbmZvKG5hbWUpIDogcDJCb2FyZC5nZXRTaGlwSW5mbyhuYW1lKTtcbiAgfTtcblxuICBsZXQgc3RhcnQgPSBmdW5jdGlvbiAoKSB7fTtcblxuICByZXR1cm4geyBwbGFjZVNoaXAsIGdldFNoaXBJbmZvIH07XG59XG4iLCJpbXBvcnQgU2hpcCBmcm9tICcuL1NoaXAnO1xuaW1wb3J0IFNoaXBOYW1lcyBmcm9tICcuL1NoaXBOYW1lcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJvYXJkKHNpemUpIHtcbiAgbGV0IHNoaXBzID0ge307XG4gIHNoaXBzW1NoaXBOYW1lcy5DYXJyaWVyXSA9IFNoaXAoNSk7XG4gIHNoaXBzW1NoaXBOYW1lcy5CYXR0bGVzaGlwXSA9IFNoaXAoNCk7XG4gIHNoaXBzW1NoaXBOYW1lcy5EZXN0cm95ZXJdID0gU2hpcCgzKTtcbiAgc2hpcHNbU2hpcE5hbWVzLlN1Ym1hcmluZV0gPSBTaGlwKDMpO1xuICBzaGlwc1tTaGlwTmFtZXMuUGF0cm9sQm9hdF0gPSBTaGlwKDIpO1xuICBsZXQgcGxhY2VkU2hpcHMgPSBbXTtcbiAgbGV0IHZhbGlkYXRlU2hpcEluZm8gPSBmdW5jdGlvbiAobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCkge1xuICAgIGlmIChzaGlwc1tuYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvcjogbmFtZSBtdXN0IGJlIGEgdmFsaWQgc2hpcCBuYW1lJyk7XG4gICAgaWYgKHggPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcigneCBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB6ZXJvJyk7XG4gICAgaWYgKHkgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcigneSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB6ZXJvJyk7XG4gICAgaWYgKGhvcml6b250YWwgJiYgeCArIHNoaXBzW25hbWVdLmdldExlbmd0aCgpIC0gMSA+PSBzaXplKVxuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXG4gICAgICAgIGB4IG11c3QgYmUgbGVzcyB0aGFuIHRoZSBzaXplIG9mIHRoZSBib2FyZCAoJHtzaXplfSlgXG4gICAgICApO1xuICAgIGlmICghaG9yaXpvbnRhbCAmJiB5ICsgc2hpcHNbbmFtZV0uZ2V0TGVuZ3RoKCkgLSAxID49IHNpemUpXG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcbiAgICAgICAgYHkgbXVzdCBiZSBsZXNzIHRoYW4gdGhlIHNpemUgb2YgdGhlIGJvYXJkICgke3NpemV9KWBcbiAgICAgICk7XG4gIH07XG5cbiAgbGV0IGlzVmFsaWRTaGlwUGxhY2VtZW50ID0gZnVuY3Rpb24gKG5hbWUsIHgsIHksIGhvcml6b250YWwpIHtcbiAgICBpZiAoc2hpcHNbbmFtZV0gPT09IHVuZGVmaW5lZClcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3I6IG5hbWUgbXVzdCBiZSBhIHZhbGlkIHNoaXAgbmFtZScpO1xuICAgIGxldCBsZWZ0ID0geDtcbiAgICBsZXQgdG9wID0geTtcbiAgICBsZXQgcmlnaHQgPSBob3Jpem9udGFsID8gbGVmdCArIHNoaXBzW25hbWVdLmdldExlbmd0aCgpIC0gMSA6IGxlZnQ7XG4gICAgbGV0IGJvdHRvbSA9IGhvcml6b250YWwgPyB0b3AgOiB0b3AgKyBzaGlwc1tuYW1lXS5nZXRMZW5ndGgoKSAtIDE7XG4gICAgcmV0dXJuICFwbGFjZWRTaGlwcy5zb21lKCh2YWwpID0+IHtcbiAgICAgIGlmICh2YWwgIT09IG5hbWUpIHtcbiAgICAgICAgbGV0IGwgPSBzaGlwc1t2YWxdLmdldE9yaWdpbigpLng7XG4gICAgICAgIGxldCB0ID0gc2hpcHNbdmFsXS5nZXRPcmlnaW4oKS55O1xuICAgICAgICBsZXQgciA9IHNoaXBzW3ZhbF0uaXNIb3Jpem9udGFsKCkgPyBsICsgc2hpcHNbdmFsXS5nZXRMZW5ndGgoKSAtIDEgOiBsO1xuICAgICAgICBsZXQgYiA9IHNoaXBzW3ZhbF0uaXNIb3Jpem9udGFsKCkgPyB0IDogdCArIHNoaXBzW3ZhbF0uZ2V0TGVuZ3RoKCkgLSAxO1xuICAgICAgICAvLyBzaGlwcyBjb2xsaWRlXG4gICAgICAgIGlmIChcbiAgICAgICAgICAoKGxlZnQgPj0gbCAmJiBsZWZ0IDw9IHIpIHx8IChyaWdodCA+PSBsICYmIHJpZ2h0IDw9IHIpKSAmJlxuICAgICAgICAgICgodG9wID49IHQgJiYgdG9wIDw9IGIpIHx8IChib3R0b20gPj0gdCAmJiBib3R0b20gPD0gYikpXG4gICAgICAgICkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgbGV0IHBsYWNlU2hpcCA9IGZ1bmN0aW9uIChuYW1lLCB4LCB5LCBob3Jpem9udGFsKSB7XG4gICAgdmFsaWRhdGVTaGlwSW5mbyhuYW1lLCB4LCB5LCBob3Jpem9udGFsKTtcbiAgICBpZiAoIWlzVmFsaWRTaGlwUGxhY2VtZW50KG5hbWUsIHgsIHksIGhvcml6b250YWwpKSByZXR1cm4gZmFsc2U7XG4gICAgc2hpcHNbbmFtZV0uc2V0T3JpZ2luKHgsIHkpO1xuICAgIHNoaXBzW25hbWVdLnNldEhvcml6b250YWwoaG9yaXpvbnRhbCk7XG4gICAgaWYgKCFwbGFjZWRTaGlwcy5pbmNsdWRlcyhuYW1lKSkgcGxhY2VkU2hpcHMucHVzaChuYW1lKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBsZXQgcmVtb3ZlU2hpcCA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgaWYgKHNoaXBzW25hbWVdID09PSB1bmRlZmluZWQpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yOiBuYW1lIG11c3QgYmUgYSB2YWxpZCBzaGlwIG5hbWUnKTtcbiAgICBwbGFjZWRTaGlwcyA9IHBsYWNlZFNoaXBzLmZpbHRlcigodikgPT4gdiAhPT0gbmFtZSk7XG4gICAgc2hpcHNbbmFtZV0ucmVzZXRIaXRzKCk7XG4gIH07XG5cbiAgbGV0IGhpdCA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgZm9yIChjb25zdCBuYW1lIGluIHNoaXBzKSB7XG4gICAgICBpZiAocGxhY2VkU2hpcHMuaW5jbHVkZXMobmFtZSkgJiYgc2hpcHNbbmFtZV0uaGl0KHgsIHkpKSByZXR1cm4gbmFtZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGxldCBpc1N1bmsgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIGlmIChzaGlwc1tuYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvcjogbmFtZSBtdXN0IGJlIGEgdmFsaWQgc2hpcCBuYW1lJyk7XG4gICAgcmV0dXJuIHNoaXBzW25hbWVdLmlzU3VuaygpO1xuICB9O1xuXG4gIGxldCBnZXRTaGlwSW5mbyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgaWYgKHNoaXBzW25hbWVdID09PSB1bmRlZmluZWQpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yOiBuYW1lIG11c3QgYmUgYSB2YWxpZCBzaGlwIG5hbWUnKTtcbiAgICBpZiAoIXBsYWNlZFNoaXBzLmluY2x1ZGVzKG5hbWUpKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIHJldHVybiB7XG4gICAgICBvcmlnaW46IHNoaXBzW25hbWVdLmdldE9yaWdpbigpLFxuICAgICAgaG9yaXpvbnRhbDogc2hpcHNbbmFtZV0uaXNIb3Jpem9udGFsKCksXG4gICAgICBzdW5rOiBzaGlwc1tuYW1lXS5pc1N1bmsoKSxcbiAgICAgIGxlbmd0aDogc2hpcHNbbmFtZV0uZ2V0TGVuZ3RoKCksXG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHBsYWNlU2hpcCxcbiAgICByZW1vdmVTaGlwLFxuICAgIGhpdCxcbiAgICBpc1N1bmssXG4gICAgZ2V0U2hpcEluZm8sXG4gIH07XG59XG4iLCJpbXBvcnQgRGlzcGxheUJvYXJkIGZyb20gJy4vRGlzcGxheUJvYXJkJztcbmltcG9ydCBTaGlweWFyZCBmcm9tICcuL1NoaXB5YXJkJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRGlzcGxheShiYXR0bGVzaGlwLCBjb250YWluZXIpIHtcbiAgbGV0IG9wcG9uZW50ID0gRGlzcGxheUJvYXJkKGNvbnRhaW5lcik7XG4gIGxldCBwbGF5ZXIgPSBEaXNwbGF5Qm9hcmQoY29udGFpbmVyKTtcbiAgcGxheWVyLm9uQ2VsbERyb3AgPSAoZSwgeCwgeSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBsZXQgaW5mbyA9IEpTT04ucGFyc2UoZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgndGV4dCcpKTtcbiAgICBsZXQgb3JpZ2luID0gcGxheWVyLmNlbGxGcm9tUG9pbnQoXG4gICAgICBlLnggLSBlLm9mZnNldFggLSBpbmZvLm9mZnNldFggKyAyNSxcbiAgICAgIGUueSAtIGUub2Zmc2V0WSAtIGluZm8ub2Zmc2V0WSArIDI1XG4gICAgKTtcbiAgICBiYXR0bGVzaGlwLnBsYWNlU2hpcChpbmZvLm5hbWUsIG9yaWdpbi54LCBvcmlnaW4ueSwgdHJ1ZSk7XG4gICAgcGxheWVyLmRyYXdTaGlwKGluZm8ubmFtZSwgYmF0dGxlc2hpcC5nZXRTaGlwSW5mbyhpbmZvLm5hbWUsIHRydWUpKTtcbiAgfTtcbiAgcGxheWVyLm9uQ2VsbENsaWNrID0gKGUsIHgsIHkpID0+IHt9O1xuICBsZXQgc2hpcHlhcmQgPSBTaGlweWFyZChjb250YWluZXIpO1xuICBzaGlweWFyZC5vblNoaXBEcmFnU3RhcnQgPSAoZSwgbmFtZSkgPT4ge1xuICAgIGUuZGF0YVRyYW5zZmVyLnNldERhdGEoXG4gICAgICAndGV4dCcsXG4gICAgICBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIG5hbWU6IGUudGFyZ2V0LmlkLFxuICAgICAgICBvZmZzZXRYOiBlLm9mZnNldFgsXG4gICAgICAgIG9mZnNldFk6IGUub2Zmc2V0WSxcbiAgICAgIH0pXG4gICAgKTtcbiAgfTtcbiAgc2hpcHlhcmQub25TaGlwQ2xpY2sgPSAoZSwgbmFtZSkgPT4ge1xuICAgIC8vIGxldCBpbmZvID0gYm9hcmQuZ2V0U2hpcEluZm8obmFtZSk7XG4gICAgLy8gaWYgKGluZm8gPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgIC8vIGNvbnNvbGUubG9nKGluZm8pO1xuICAgIC8vIGJvYXJkLnBsYWNlU2hpcChuYW1lLCBpbmZvLm9yaWdpbi54LCBpbmZvLm9yaWdpbi55LCAhaW5mby5ob3Jpem9udGFsKTtcbiAgfTtcbiAgcmV0dXJuIHt9O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRGlzcGxheUJvYXJkKGNvbnRhaW5lcikge1xuICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpdi5jbGFzc0xpc3QuYWRkKCdib2FyZCcpO1xuXG4gIGxldCBkaXNwbGF5Qm9hcmQgPSB7fTtcbiAgZGlzcGxheUJvYXJkLm9uQ2VsbERyb3AgPSB7fTtcbiAgZGlzcGxheUJvYXJkLm9uQ2VsbENsaWNrID0ge307XG4gIGRpc3BsYXlCb2FyZC5jZWxsRnJvbVBvaW50ID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICBsZXQgY2VsbCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoeCwgeSk7XG4gICAgaWYgKGNlbGwuY2xhc3NMaXN0LmNvbnRhaW5zKCdjZWxsJykgJiYgZGl2LmNvbnRhaW5zKGNlbGwpKVxuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoY2VsbC5pZCk7XG4gICAgZWxzZSByZXR1cm4gdW5kZWZpbmVkO1xuICB9O1xuXG4gIGRpc3BsYXlCb2FyZC5kcmF3U2hpcCA9IGZ1bmN0aW9uIChuYW1lLCBpbmZvKSB7XG4gICAgaWYgKGluZm8gIT0gdW5kZWZpbmVkKSB7XG4gICAgICBsZXQgc2hpcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWUpO1xuICAgICAgbGV0IHJpZ2h0ID0gaW5mby5vcmlnaW4ueCArIDM7XG4gICAgICBsZXQgYm90dG9tID0gaW5mby5vcmlnaW4ueSArIDM7XG4gICAgICBpZiAoaW5mby5ob3Jpem9udGFsKSB7XG4gICAgICAgIHJpZ2h0ICs9IGluZm8ubGVuZ3RoIC0gMTtcbiAgICAgICAgc2hpcC5jbGFzc0xpc3QucmVtb3ZlKCd2ZXJ0aWNhbFNoaXAnKTtcbiAgICAgICAgc2hpcC5jbGFzc0xpc3QuYWRkKCdob3Jpem9udGFsU2hpcCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYm90dG9tICs9IGluZm8ubGVuZ3RoIC0gMTtcbiAgICAgICAgc2hpcC5jbGFzc0xpc3QucmVtb3ZlKCdob3Jpem9udGFsU2hpcCcpO1xuICAgICAgICBzaGlwLmNsYXNzTGlzdC5hZGQoJ3ZlcnRpY2FsU2hpcCcpO1xuICAgICAgfVxuICAgICAgc2hpcC5zdHlsZS5ncmlkQXJlYSA9IGBcbiAgICAgICAgICAgICR7aW5mby5vcmlnaW4ueSArIDJ9IC9cbiAgICAgICAgICAgICR7aW5mby5vcmlnaW4ueCArIDJ9IC9cbiAgICAgICAgICAgICR7Ym90dG9tfSAvXG4gICAgICAgICAgICAke3JpZ2h0fWA7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoc2hpcCk7XG4gICAgfVxuICB9O1xuXG4gIGxldCBzZXR1cENlbGxzID0gZnVuY3Rpb24gKCkge1xuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgMTE7IHkrKykge1xuICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCAxMTsgeCsrKSB7XG4gICAgICAgIGxldCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGNlbGwuaWQgPSBKU09OLnN0cmluZ2lmeSh7IHg6IHggLSAxLCB5OiB5IC0gMSB9KTtcbiAgICAgICAgY2VsbC5zdHlsZS5ncmlkQXJlYSA9IGAke3kgKyAxfSAvICR7eCArIDF9IC8gJHt5ICsgMn0gLyAke3ggKyAyfWA7XG4gICAgICAgIGlmICh5ID09PSAwICYmIHggPiAwKSB7XG4gICAgICAgICAgY2VsbC50ZXh0Q29udGVudCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoNjQgKyB4KTtcbiAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ2xhYmVsQ2VsbCcpO1xuICAgICAgICB9IGVsc2UgaWYgKHggPT09IDAgJiYgeSA+IDApIHtcbiAgICAgICAgICBjZWxsLnRleHRDb250ZW50ID0geS50b1N0cmluZygpO1xuICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnbGFiZWxDZWxsJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoeCA+IDAgJiYgeSA+IDApIGNlbGwuY2xhc3NMaXN0LmFkZCgnY2VsbCcpO1xuXG4gICAgICAgIGNlbGwub25kcmFnb3ZlciA9IChlKSA9PiBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNlbGwub25kcm9wID0gKGUpID0+IHtcbiAgICAgICAgICBpZiAoZGlzcGxheUJvYXJkLm9uQ2VsbERyb3AgaW5zdGFuY2VvZiBGdW5jdGlvbilcbiAgICAgICAgICAgIGRpc3BsYXlCb2FyZC5vbkNlbGxEcm9wKGUsIHggKyAxLCB5ICsgMSk7XG4gICAgICAgIH07XG4gICAgICAgIGNlbGwub25jbGljayA9IChlKSA9PiB7XG4gICAgICAgICAgaWYgKGRpc3BsYXlCb2FyZC5vbkNlbGxDbGljayBpbnN0YW5jZW9mIEZ1bmN0aW9uKVxuICAgICAgICAgICAgZGlzcGxheUJvYXJkLm9uQ2VsbENsaWNrKGUsIHggKyAxLCB5ICsgMSk7XG4gICAgICAgIH07XG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChjZWxsKTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRpdik7XG4gIH07XG5cbiAgc2V0dXBDZWxscygpO1xuICByZXR1cm4gZGlzcGxheUJvYXJkO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2hpcChsZW5ndGgpIHtcbiAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKGxlbmd0aCkpXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignbGVuZ3RoIG11c3QgYmUgYW4gaW50ZWdlcicpO1xuICBlbHNlIGlmIChsZW5ndGggPCAwKVxuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdTaGlwIGxlbmd0aCBjYW5ub3QgYmUgbGVzcyB0aGFuIHplcm8nKTtcbiAgbGV0IHggPSAwO1xuICBsZXQgeSA9IDA7XG4gIGxldCBob3Jpem9udGFsID0gZmFsc2U7XG4gIGxldCBoaXRzID0gW107XG5cbiAgbGV0IGdldExlbmd0aCA9ICgpID0+IHtcbiAgICByZXR1cm4gbGVuZ3RoO1xuICB9O1xuXG4gIGxldCBzZXRPcmlnaW4gPSAobmV3WCwgbmV3WSkgPT4ge1xuICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcihuZXdYKSkgdGhyb3cgbmV3IFR5cGVFcnJvcigneCBtdXN0IGJlIGFuIGludGVnZXInKTtcbiAgICBlbHNlIGlmICghTnVtYmVyLmlzSW50ZWdlcihuZXdZKSlcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3kgbXVzdCBiZSBhbiBpbnRlZ2VyJyk7XG5cbiAgICB4ID0gbmV3WDtcbiAgICB5ID0gbmV3WTtcbiAgfTtcblxuICBsZXQgZ2V0T3JpZ2luID0gKCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICB4LFxuICAgICAgeSxcbiAgICB9O1xuICB9O1xuXG4gIGxldCBpc0hvcml6b250YWwgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGhvcml6b250YWw7XG4gIH07XG5cbiAgbGV0IHNldEhvcml6b250YWwgPSAodmFsdWUpID0+IHtcbiAgICBob3Jpem9udGFsID0gISF2YWx1ZTtcbiAgfTtcblxuICBsZXQgaGl0ID0gKHRhcmdldFgsIHRhcmdldFkpID0+IHtcbiAgICBpZiAoIU51bWJlci5pc0ludGVnZXIodGFyZ2V0WCkpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0YXJnZXRYIG11c3QgYmUgYW4gaW50ZWdlcicpO1xuICAgIGVsc2UgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKHRhcmdldFkpKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndGFyZ2V0WSBtdXN0IGJlIGFuIGludGVnZXInKTtcblxuICAgIGxldCBzdWNjZXNzID1cbiAgICAgIChob3Jpem9udGFsICYmIHkgPT09IHRhcmdldFkgJiYgdGFyZ2V0WCA+PSB4ICYmIHRhcmdldFggPCB4ICsgbGVuZ3RoKSB8fFxuICAgICAgKCFob3Jpem9udGFsICYmIHggPT09IHRhcmdldFggJiYgdGFyZ2V0WSA+PSB5ICYmIHRhcmdldFkgPCB5ICsgbGVuZ3RoKTtcbiAgICBpZiAoc3VjY2VzcykgaGl0cy5wdXNoKHsgeDogdGFyZ2V0WCwgeTogdGFyZ2V0WSB9KTtcbiAgICByZXR1cm4gc3VjY2VzcztcbiAgfTtcblxuICBsZXQgaXNTdW5rID0gKCkgPT4ge1xuICAgIGlmIChoaXRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiBoaXRzLmV2ZXJ5KCh2KSA9PiB7XG4gICAgICBpZiAoaG9yaXpvbnRhbCkgcmV0dXJuIHYueSA9PT0geSAmJiB2LnggPj0geCAmJiB2LnggPCB4ICsgbGVuZ3RoO1xuICAgICAgZWxzZSByZXR1cm4gdi54ID09PSB4ICYmIHYueSA+PSB5ICYmIHYueSA8IHkgKyBsZW5ndGg7XG4gICAgfSk7XG4gIH07XG5cbiAgbGV0IHJlc2V0SGl0cyA9ICgpID0+IChoaXRzLmxlbmd0aCA9IDApO1xuICByZXR1cm4ge1xuICAgIGdldExlbmd0aCxcbiAgICBnZXRPcmlnaW4sXG4gICAgc2V0T3JpZ2luLFxuICAgIGlzSG9yaXpvbnRhbCxcbiAgICBzZXRIb3Jpem9udGFsLFxuICAgIGhpdCxcbiAgICBpc1N1bmssXG4gICAgcmVzZXRIaXRzLFxuICB9O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIFNoaXBOYW1lcygpIHtcbiAgcmV0dXJuIHtcbiAgICBDYXJyaWVyOiAnQ2FycmllcicsXG4gICAgQmF0dGxlc2hpcDogJ0JhdHRsZXNoaXAnLFxuICAgIERlc3Ryb3llcjogJ0Rlc3Ryb3llcicsXG4gICAgU3VibWFyaW5lOiAnU3VibWFyaW5lJyxcbiAgICBQYXRyb2xCb2F0OiAnUGF0cm9sQm9hdCcsXG4gIH07XG59KSgpO1xuIiwiaW1wb3J0IFNoaXBOYW1lcyBmcm9tICcuL1NoaXBOYW1lcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNoaXB5YXJkKGNvbnRhaW5lcikge1xuICBsZXQgc2hpcHlhcmQgPSB7fTtcbiAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBkaXYuY2xhc3NMaXN0LmFkZCgnc2hpcHlhcmQnKTtcbiAgc2hpcHlhcmQub25TaGlwQ2xpY2sgPSB7fTtcbiAgc2hpcHlhcmQub25TaGlwRHJhZ1N0YXJ0ID0ge307XG5cbiAgZm9yIChjb25zdCBuYW1lIGluIFNoaXBOYW1lcykge1xuICAgIGxldCBzaGlwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgc2hpcC5jbGFzc0xpc3QuYWRkKG5hbWUpO1xuICAgIHNoaXAuaWQgPSBuYW1lO1xuICAgIHNoaXAuY2xhc3NMaXN0LmFkZCgnc2hpcCcpO1xuICAgIHNoaXAuY2xhc3NMaXN0LmFkZCgndmVydGljYWxTaGlwJyk7XG4gICAgc2hpcC5zdHlsZS5ncmlkQXJlYSA9IG5hbWU7XG4gICAgc2hpcC5kcmFnZ2FibGUgPSB0cnVlO1xuICAgIHNoaXAub25kcmFnc3RhcnQgPSAoZSkgPT4ge1xuICAgICAgaWYgKHNoaXB5YXJkLm9uU2hpcERyYWdTdGFydCBpbnN0YW5jZW9mIEZ1bmN0aW9uKVxuICAgICAgICBzaGlweWFyZC5vblNoaXBEcmFnU3RhcnQoZSwgbmFtZSk7XG4gICAgfTtcbiAgICBzaGlwLm9uY2xpY2sgPSAoZSkgPT4ge1xuICAgICAgaWYgKHNoaXB5YXJkLm9uU2hpcENsaWNrIGluc3RhbmNlb2YgRnVuY3Rpb24pXG4gICAgICAgIHNoaXB5YXJkLm9uU2hpcENsaWNrKGUsIG5hbWUpO1xuICAgIH07XG4gICAgc2hpcC50ZXh0Q29udGVudCA9IG5hbWU7XG4gICAgZGl2LmFwcGVuZENoaWxkKHNoaXApO1xuICB9XG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkaXYpO1xuICByZXR1cm4gc2hpcHlhcmQ7XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBCYXR0bGVzaGlwIGZyb20gJy4vQmF0dGxlc2hpcCc7XG5pbXBvcnQgQm9hcmQgZnJvbSAnLi9Cb2FyZCc7XG5pbXBvcnQgRGlzcGxheSBmcm9tICcuL0Rpc3BsYXknO1xuaW1wb3J0IERpc3BsYXlCb2FyZCBmcm9tICcuL0Rpc3BsYXlCb2FyZCc7XG5pbXBvcnQgU2hpcHlhcmREaXNwbGF5IGZyb20gJy4vU2hpcHlhcmQnO1xuXG5sZXQgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcicpO1xuLy8gbGV0IG9wcG9uZW50ID0gbmV3IERpc3BsYXlCb2FyZChjb250YWluZXIpO1xuLy8gbGV0IGJvYXJkID0gQm9hcmQoMTApO1xuLy8gbGV0IHBsYXllciA9IG5ldyBEaXNwbGF5Qm9hcmQoY29udGFpbmVyLCBib2FyZCk7XG4vLyBsZXQgc2hpcHlhcmQgPSBuZXcgU2hpcHlhcmREaXNwbGF5KGNvbnRhaW5lciwgYm9hcmQpO1xubGV0IGRpc3BsYXkgPSBEaXNwbGF5KG5ldyBCYXR0bGVzaGlwKCksIGNvbnRhaW5lcik7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=