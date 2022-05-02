/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
  ships[_ShipNames__WEBPACK_IMPORTED_MODULE_1__["default"].Submarine] = (0,_Ship__WEBPACK_IMPORTED_MODULE_0__["default"])(2);
  ships[_ShipNames__WEBPACK_IMPORTED_MODULE_1__["default"].PatrolBoat] = (0,_Ship__WEBPACK_IMPORTED_MODULE_0__["default"])(2);
  let placedShips = [];
  let validateShipInfo = function (name, x, y) {
    if (ships[name] === undefined)
      throw new Error('Error: name must be a valid ship name');
    if (x < 0) throw new RangeError('x must be greater than or equal to zero');
    if (y < 0) throw new RangeError('y must be greater than or equal to zero');
    if (ships[name].isHorizontal() && x + ships[name].getLength() - 1 >= size)
      throw new RangeError(
        `x must be less than the size of the board (${size})`
      );
    if (!ships[name].isHorizontal() && y + ships[name].getLength() - 1 >= size)
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
    validateShipInfo(name, x, y);
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

/***/ "./src/DisplayBoard.js":
/*!*****************************!*\
  !*** ./src/DisplayBoard.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DisplayBoard)
/* harmony export */ });
/* harmony import */ var _ShipNames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ShipNames */ "./src/ShipNames.js");


class DisplayBoard {
  constructor(container, board) {
    let div = document.createElement('div');
    div.classList.add('board');
    let draw = function () {
      for (const name in _ShipNames__WEBPACK_IMPORTED_MODULE_0__["default"]) {
        let info = board.getShipInfo(name);
        console.log(`${info}, ${name}`);
        if (info != undefined) {
          let shipIcon = document.getElementById(name);
          console.log(info);
          shipIcon.style.gridArea = `${info.origin.y + 2} / ${
            info.origin.x + 2
          } / ${info.origin.y + 2 + info.length} / ${info.origin.x + 3}`;
          div.appendChild(shipIcon);
        }
      }
    };

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
          e.preventDefault();
          let info = JSON.parse(e.dataTransfer.getData('text'));
          let origin = document.elementFromPoint(
            e.x - e.offsetX - info.offsetX + 25,
            e.y - e.offsetY - info.offsetY + 25
          );
          if (origin.classList.contains('cell') && div.contains(origin)) {
            let originCoords = JSON.parse(origin.id);
            console.log(info);
            board.removeShip(info.id);
            board.placeShip(info.id, originCoords.x, originCoords.y, false);
            draw();
          }
        };
        // cell.ondrop = (e) => {
        //   e.preventDefault();
        //   let info = JSON.parse(e.dataTransfer.getData('text'));
        //   let origin = document.elementFromPoint(
        //     e.x - e.offsetX - info.offsetX + 25,
        //     e.y - e.offsetY - info.offsetY + 25
        //   );
        //   if (origin.classList.contains('cell') && div.contains(origin)) {
        //     let originCoords = JSON.parse(origin.id);
        //     console.log(originCoords);
        //     cell.style.backgroundColor = 'red';
        //     origin.style.backgroundColor = 'blue';
        //   }
        // };
        div.appendChild(cell);
      }
    }
    container.appendChild(div);
  }
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
  let horizontal = true;
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

/***/ "./src/ShipyardDisplay.js":
/*!********************************!*\
  !*** ./src/ShipyardDisplay.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ShipyardDisplay)
/* harmony export */ });
/* harmony import */ var _ShipNames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ShipNames */ "./src/ShipNames.js");


class ShipyardDisplay {
  constructor(container) {
    let div = document.createElement('div');
    div.classList.add('shipyard');
    for (const name in _ShipNames__WEBPACK_IMPORTED_MODULE_0__["default"]) {
      let ship = document.createElement('div');
      ship.classList.add(name);
      ship.id = name;
      ship.classList.add('ship');
      ship.style.gridArea = name;
      ship.draggable = true;
      ship.ondragstart = (e) => {
        e.dataTransfer.setData(
          'text',
          JSON.stringify({
            id: e.target.id,
            offsetX: e.offsetX,
            offsetY: e.offsetY,
          })
        );
      };
      ship.textContent = name;
      div.appendChild(ship);
    }
    container.appendChild(div);
  }
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
/* harmony import */ var _Board__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Board */ "./src/Board.js");
/* harmony import */ var _DisplayBoard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DisplayBoard */ "./src/DisplayBoard.js");
/* harmony import */ var _ShipyardDisplay__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ShipyardDisplay */ "./src/ShipyardDisplay.js");




let container = document.getElementById('container');
let opponent = new _DisplayBoard__WEBPACK_IMPORTED_MODULE_1__["default"](container);
let player = new _DisplayBoard__WEBPACK_IMPORTED_MODULE_1__["default"](container, (0,_Board__WEBPACK_IMPORTED_MODULE_0__["default"])(10));
let shipyard = new _ShipyardDisplay__WEBPACK_IMPORTED_MODULE_2__["default"](container);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQTBCO0FBQ1U7O0FBRXJCO0FBQ2Y7QUFDQSxRQUFRLDBEQUFpQixJQUFJLGlEQUFJO0FBQ2pDLFFBQVEsNkRBQW9CLElBQUksaURBQUk7QUFDcEMsUUFBUSw0REFBbUIsSUFBSSxpREFBSTtBQUNuQyxRQUFRLDREQUFtQixJQUFJLGlEQUFJO0FBQ25DLFFBQVEsNkRBQW9CLElBQUksaURBQUk7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRCxLQUFLO0FBQzNEO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRCxLQUFLO0FBQzNEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztBQ2xHb0M7O0FBRXJCO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsa0RBQVM7QUFDbEM7QUFDQSx1QkFBdUIsS0FBSyxJQUFJLEtBQUs7QUFDckM7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLG1CQUFtQjtBQUMxRDtBQUNBLFlBQVksSUFBSSxpQ0FBaUMsSUFBSSxrQkFBa0I7QUFDdkU7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0JBQW9CLFFBQVE7QUFDNUIsc0JBQXNCLFFBQVE7QUFDOUI7QUFDQSxtQ0FBbUMsb0JBQW9CO0FBQ3ZELGlDQUFpQyxPQUFPLElBQUksT0FBTyxJQUFJLE9BQU8sSUFBSSxNQUFNO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDcEVlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLHdCQUF3QjtBQUNyRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUN0RUEsaUVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsR0FBRyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDUitCOztBQUVyQjtBQUNmO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixrREFBUztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O1VDNUJBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7OztBQ040QjtBQUNjO0FBQ007O0FBRWhEO0FBQ0EsbUJBQW1CLHFEQUFZO0FBQy9CLGlCQUFpQixxREFBWSxZQUFZLGtEQUFLO0FBQzlDLG1CQUFtQix3REFBZSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvQm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9EaXNwbGF5Qm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9TaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvU2hpcE5hbWVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvU2hpcHlhcmREaXNwbGF5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTaGlwIGZyb20gJy4vU2hpcCc7XG5pbXBvcnQgU2hpcE5hbWVzIGZyb20gJy4vU2hpcE5hbWVzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQm9hcmQoc2l6ZSkge1xuICBsZXQgc2hpcHMgPSB7fTtcbiAgc2hpcHNbU2hpcE5hbWVzLkNhcnJpZXJdID0gU2hpcCg1KTtcbiAgc2hpcHNbU2hpcE5hbWVzLkJhdHRsZXNoaXBdID0gU2hpcCg0KTtcbiAgc2hpcHNbU2hpcE5hbWVzLkRlc3Ryb3llcl0gPSBTaGlwKDMpO1xuICBzaGlwc1tTaGlwTmFtZXMuU3VibWFyaW5lXSA9IFNoaXAoMik7XG4gIHNoaXBzW1NoaXBOYW1lcy5QYXRyb2xCb2F0XSA9IFNoaXAoMik7XG4gIGxldCBwbGFjZWRTaGlwcyA9IFtdO1xuICBsZXQgdmFsaWRhdGVTaGlwSW5mbyA9IGZ1bmN0aW9uIChuYW1lLCB4LCB5KSB7XG4gICAgaWYgKHNoaXBzW25hbWVdID09PSB1bmRlZmluZWQpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yOiBuYW1lIG11c3QgYmUgYSB2YWxpZCBzaGlwIG5hbWUnKTtcbiAgICBpZiAoeCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCd4IG11c3QgYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHplcm8nKTtcbiAgICBpZiAoeSA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCd5IG11c3QgYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHplcm8nKTtcbiAgICBpZiAoc2hpcHNbbmFtZV0uaXNIb3Jpem9udGFsKCkgJiYgeCArIHNoaXBzW25hbWVdLmdldExlbmd0aCgpIC0gMSA+PSBzaXplKVxuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXG4gICAgICAgIGB4IG11c3QgYmUgbGVzcyB0aGFuIHRoZSBzaXplIG9mIHRoZSBib2FyZCAoJHtzaXplfSlgXG4gICAgICApO1xuICAgIGlmICghc2hpcHNbbmFtZV0uaXNIb3Jpem9udGFsKCkgJiYgeSArIHNoaXBzW25hbWVdLmdldExlbmd0aCgpIC0gMSA+PSBzaXplKVxuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXG4gICAgICAgIGB5IG11c3QgYmUgbGVzcyB0aGFuIHRoZSBzaXplIG9mIHRoZSBib2FyZCAoJHtzaXplfSlgXG4gICAgICApO1xuICB9O1xuXG4gIGxldCBpc1ZhbGlkU2hpcFBsYWNlbWVudCA9IGZ1bmN0aW9uIChuYW1lLCB4LCB5LCBob3Jpem9udGFsKSB7XG4gICAgaWYgKHNoaXBzW25hbWVdID09PSB1bmRlZmluZWQpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yOiBuYW1lIG11c3QgYmUgYSB2YWxpZCBzaGlwIG5hbWUnKTtcbiAgICBsZXQgbGVmdCA9IHg7XG4gICAgbGV0IHRvcCA9IHk7XG4gICAgbGV0IHJpZ2h0ID0gaG9yaXpvbnRhbCA/IGxlZnQgKyBzaGlwc1tuYW1lXS5nZXRMZW5ndGgoKSAtIDEgOiBsZWZ0O1xuICAgIGxldCBib3R0b20gPSBob3Jpem9udGFsID8gdG9wIDogdG9wICsgc2hpcHNbbmFtZV0uZ2V0TGVuZ3RoKCkgLSAxO1xuICAgIHJldHVybiAhcGxhY2VkU2hpcHMuc29tZSgodmFsKSA9PiB7XG4gICAgICBpZiAodmFsICE9PSBuYW1lKSB7XG4gICAgICAgIGxldCBsID0gc2hpcHNbdmFsXS5nZXRPcmlnaW4oKS54O1xuICAgICAgICBsZXQgdCA9IHNoaXBzW3ZhbF0uZ2V0T3JpZ2luKCkueTtcbiAgICAgICAgbGV0IHIgPSBzaGlwc1t2YWxdLmlzSG9yaXpvbnRhbCgpID8gbCArIHNoaXBzW3ZhbF0uZ2V0TGVuZ3RoKCkgLSAxIDogbDtcbiAgICAgICAgbGV0IGIgPSBzaGlwc1t2YWxdLmlzSG9yaXpvbnRhbCgpID8gdCA6IHQgKyBzaGlwc1t2YWxdLmdldExlbmd0aCgpIC0gMTtcbiAgICAgICAgLy8gc2hpcHMgY29sbGlkZVxuICAgICAgICBpZiAoXG4gICAgICAgICAgKChsZWZ0ID49IGwgJiYgbGVmdCA8PSByKSB8fCAocmlnaHQgPj0gbCAmJiByaWdodCA8PSByKSkgJiZcbiAgICAgICAgICAoKHRvcCA+PSB0ICYmIHRvcCA8PSBiKSB8fCAoYm90dG9tID49IHQgJiYgYm90dG9tIDw9IGIpKVxuICAgICAgICApIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGxldCBwbGFjZVNoaXAgPSBmdW5jdGlvbiAobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCkge1xuICAgIHZhbGlkYXRlU2hpcEluZm8obmFtZSwgeCwgeSk7XG4gICAgaWYgKCFpc1ZhbGlkU2hpcFBsYWNlbWVudChuYW1lLCB4LCB5LCBob3Jpem9udGFsKSkgcmV0dXJuIGZhbHNlO1xuICAgIHNoaXBzW25hbWVdLnNldE9yaWdpbih4LCB5KTtcbiAgICBzaGlwc1tuYW1lXS5zZXRIb3Jpem9udGFsKGhvcml6b250YWwpO1xuICAgIGlmICghcGxhY2VkU2hpcHMuaW5jbHVkZXMobmFtZSkpIHBsYWNlZFNoaXBzLnB1c2gobmFtZSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgbGV0IHJlbW92ZVNoaXAgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIGlmIChzaGlwc1tuYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvcjogbmFtZSBtdXN0IGJlIGEgdmFsaWQgc2hpcCBuYW1lJyk7XG4gICAgcGxhY2VkU2hpcHMgPSBwbGFjZWRTaGlwcy5maWx0ZXIoKHYpID0+IHYgIT09IG5hbWUpO1xuICAgIHNoaXBzW25hbWVdLnJlc2V0SGl0cygpO1xuICB9O1xuXG4gIGxldCBoaXQgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgIGZvciAoY29uc3QgbmFtZSBpbiBzaGlwcykge1xuICAgICAgaWYgKHBsYWNlZFNoaXBzLmluY2x1ZGVzKG5hbWUpICYmIHNoaXBzW25hbWVdLmhpdCh4LCB5KSkgcmV0dXJuIG5hbWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBsZXQgaXNTdW5rID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBpZiAoc2hpcHNbbmFtZV0gPT09IHVuZGVmaW5lZClcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3I6IG5hbWUgbXVzdCBiZSBhIHZhbGlkIHNoaXAgbmFtZScpO1xuICAgIHJldHVybiBzaGlwc1tuYW1lXS5pc1N1bmsoKTtcbiAgfTtcblxuICBsZXQgZ2V0U2hpcEluZm8gPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIGlmIChzaGlwc1tuYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvcjogbmFtZSBtdXN0IGJlIGEgdmFsaWQgc2hpcCBuYW1lJyk7XG4gICAgaWYgKCFwbGFjZWRTaGlwcy5pbmNsdWRlcyhuYW1lKSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICByZXR1cm4ge1xuICAgICAgb3JpZ2luOiBzaGlwc1tuYW1lXS5nZXRPcmlnaW4oKSxcbiAgICAgIGhvcml6b250YWw6IHNoaXBzW25hbWVdLmlzSG9yaXpvbnRhbCgpLFxuICAgICAgc3Vuazogc2hpcHNbbmFtZV0uaXNTdW5rKCksXG4gICAgICBsZW5ndGg6IHNoaXBzW25hbWVdLmdldExlbmd0aCgpLFxuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBwbGFjZVNoaXAsXG4gICAgcmVtb3ZlU2hpcCxcbiAgICBoaXQsXG4gICAgaXNTdW5rLFxuICAgIGdldFNoaXBJbmZvLFxuICB9O1xufVxuIiwiaW1wb3J0IFNoaXBOYW1lcyBmcm9tICcuL1NoaXBOYW1lcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpc3BsYXlCb2FyZCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRhaW5lciwgYm9hcmQpIHtcbiAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmNsYXNzTGlzdC5hZGQoJ2JvYXJkJyk7XG4gICAgbGV0IGRyYXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBmb3IgKGNvbnN0IG5hbWUgaW4gU2hpcE5hbWVzKSB7XG4gICAgICAgIGxldCBpbmZvID0gYm9hcmQuZ2V0U2hpcEluZm8obmFtZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKGAke2luZm99LCAke25hbWV9YCk7XG4gICAgICAgIGlmIChpbmZvICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGxldCBzaGlwSWNvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWUpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGluZm8pO1xuICAgICAgICAgIHNoaXBJY29uLnN0eWxlLmdyaWRBcmVhID0gYCR7aW5mby5vcmlnaW4ueSArIDJ9IC8gJHtcbiAgICAgICAgICAgIGluZm8ub3JpZ2luLnggKyAyXG4gICAgICAgICAgfSAvICR7aW5mby5vcmlnaW4ueSArIDIgKyBpbmZvLmxlbmd0aH0gLyAke2luZm8ub3JpZ2luLnggKyAzfWA7XG4gICAgICAgICAgZGl2LmFwcGVuZENoaWxkKHNoaXBJY29uKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8IDExOyB5KyspIHtcbiAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgMTE7IHgrKykge1xuICAgICAgICBsZXQgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBjZWxsLmlkID0gSlNPTi5zdHJpbmdpZnkoeyB4OiB4IC0gMSwgeTogeSAtIDEgfSk7XG4gICAgICAgIGNlbGwuc3R5bGUuZ3JpZEFyZWEgPSBgJHt5ICsgMX0gLyAke3ggKyAxfSAvICR7eSArIDJ9IC8gJHt4ICsgMn1gO1xuICAgICAgICBpZiAoeSA9PT0gMCAmJiB4ID4gMCkge1xuICAgICAgICAgIGNlbGwudGV4dENvbnRlbnQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDY0ICsgeCk7XG4gICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKCdsYWJlbENlbGwnKTtcbiAgICAgICAgfSBlbHNlIGlmICh4ID09PSAwICYmIHkgPiAwKSB7XG4gICAgICAgICAgY2VsbC50ZXh0Q29udGVudCA9IHkudG9TdHJpbmcoKTtcbiAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ2xhYmVsQ2VsbCcpO1xuICAgICAgICB9IGVsc2UgaWYgKHggPiAwICYmIHkgPiAwKSBjZWxsLmNsYXNzTGlzdC5hZGQoJ2NlbGwnKTtcbiAgICAgICAgY2VsbC5vbmRyYWdvdmVyID0gKGUpID0+IGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY2VsbC5vbmRyb3AgPSAoZSkgPT4ge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBsZXQgaW5mbyA9IEpTT04ucGFyc2UoZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgndGV4dCcpKTtcbiAgICAgICAgICBsZXQgb3JpZ2luID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChcbiAgICAgICAgICAgIGUueCAtIGUub2Zmc2V0WCAtIGluZm8ub2Zmc2V0WCArIDI1LFxuICAgICAgICAgICAgZS55IC0gZS5vZmZzZXRZIC0gaW5mby5vZmZzZXRZICsgMjVcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmIChvcmlnaW4uY2xhc3NMaXN0LmNvbnRhaW5zKCdjZWxsJykgJiYgZGl2LmNvbnRhaW5zKG9yaWdpbikpIHtcbiAgICAgICAgICAgIGxldCBvcmlnaW5Db29yZHMgPSBKU09OLnBhcnNlKG9yaWdpbi5pZCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhpbmZvKTtcbiAgICAgICAgICAgIGJvYXJkLnJlbW92ZVNoaXAoaW5mby5pZCk7XG4gICAgICAgICAgICBib2FyZC5wbGFjZVNoaXAoaW5mby5pZCwgb3JpZ2luQ29vcmRzLngsIG9yaWdpbkNvb3Jkcy55LCBmYWxzZSk7XG4gICAgICAgICAgICBkcmF3KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICAvLyBjZWxsLm9uZHJvcCA9IChlKSA9PiB7XG4gICAgICAgIC8vICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAvLyAgIGxldCBpbmZvID0gSlNPTi5wYXJzZShlLmRhdGFUcmFuc2Zlci5nZXREYXRhKCd0ZXh0JykpO1xuICAgICAgICAvLyAgIGxldCBvcmlnaW4gPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KFxuICAgICAgICAvLyAgICAgZS54IC0gZS5vZmZzZXRYIC0gaW5mby5vZmZzZXRYICsgMjUsXG4gICAgICAgIC8vICAgICBlLnkgLSBlLm9mZnNldFkgLSBpbmZvLm9mZnNldFkgKyAyNVxuICAgICAgICAvLyAgICk7XG4gICAgICAgIC8vICAgaWYgKG9yaWdpbi5jbGFzc0xpc3QuY29udGFpbnMoJ2NlbGwnKSAmJiBkaXYuY29udGFpbnMob3JpZ2luKSkge1xuICAgICAgICAvLyAgICAgbGV0IG9yaWdpbkNvb3JkcyA9IEpTT04ucGFyc2Uob3JpZ2luLmlkKTtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKG9yaWdpbkNvb3Jkcyk7XG4gICAgICAgIC8vICAgICBjZWxsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdyZWQnO1xuICAgICAgICAvLyAgICAgb3JpZ2luLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdibHVlJztcbiAgICAgICAgLy8gICB9XG4gICAgICAgIC8vIH07XG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChjZWxsKTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRpdik7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNoaXAobGVuZ3RoKSB7XG4gIGlmICghTnVtYmVyLmlzSW50ZWdlcihsZW5ndGgpKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2xlbmd0aCBtdXN0IGJlIGFuIGludGVnZXInKTtcbiAgZWxzZSBpZiAobGVuZ3RoIDwgMClcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignU2hpcCBsZW5ndGggY2Fubm90IGJlIGxlc3MgdGhhbiB6ZXJvJyk7XG4gIGxldCB4ID0gMDtcbiAgbGV0IHkgPSAwO1xuICBsZXQgaG9yaXpvbnRhbCA9IHRydWU7XG4gIGxldCBoaXRzID0gW107XG5cbiAgbGV0IGdldExlbmd0aCA9ICgpID0+IHtcbiAgICByZXR1cm4gbGVuZ3RoO1xuICB9O1xuXG4gIGxldCBzZXRPcmlnaW4gPSAobmV3WCwgbmV3WSkgPT4ge1xuICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcihuZXdYKSkgdGhyb3cgbmV3IFR5cGVFcnJvcigneCBtdXN0IGJlIGFuIGludGVnZXInKTtcbiAgICBlbHNlIGlmICghTnVtYmVyLmlzSW50ZWdlcihuZXdZKSlcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3kgbXVzdCBiZSBhbiBpbnRlZ2VyJyk7XG5cbiAgICB4ID0gbmV3WDtcbiAgICB5ID0gbmV3WTtcbiAgfTtcblxuICBsZXQgZ2V0T3JpZ2luID0gKCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICB4LFxuICAgICAgeSxcbiAgICB9O1xuICB9O1xuXG4gIGxldCBpc0hvcml6b250YWwgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGhvcml6b250YWw7XG4gIH07XG5cbiAgbGV0IHNldEhvcml6b250YWwgPSAodmFsdWUpID0+IHtcbiAgICBob3Jpem9udGFsID0gISF2YWx1ZTtcbiAgfTtcblxuICBsZXQgaGl0ID0gKHRhcmdldFgsIHRhcmdldFkpID0+IHtcbiAgICBpZiAoIU51bWJlci5pc0ludGVnZXIodGFyZ2V0WCkpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0YXJnZXRYIG11c3QgYmUgYW4gaW50ZWdlcicpO1xuICAgIGVsc2UgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKHRhcmdldFkpKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndGFyZ2V0WSBtdXN0IGJlIGFuIGludGVnZXInKTtcblxuICAgIGxldCBzdWNjZXNzID1cbiAgICAgIChob3Jpem9udGFsICYmIHkgPT09IHRhcmdldFkgJiYgdGFyZ2V0WCA+PSB4ICYmIHRhcmdldFggPCB4ICsgbGVuZ3RoKSB8fFxuICAgICAgKCFob3Jpem9udGFsICYmIHggPT09IHRhcmdldFggJiYgdGFyZ2V0WSA+PSB5ICYmIHRhcmdldFkgPCB5ICsgbGVuZ3RoKTtcbiAgICBpZiAoc3VjY2VzcykgaGl0cy5wdXNoKHsgeDogdGFyZ2V0WCwgeTogdGFyZ2V0WSB9KTtcbiAgICByZXR1cm4gc3VjY2VzcztcbiAgfTtcblxuICBsZXQgaXNTdW5rID0gKCkgPT4ge1xuICAgIGlmIChoaXRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiBoaXRzLmV2ZXJ5KCh2KSA9PiB7XG4gICAgICBpZiAoaG9yaXpvbnRhbCkgcmV0dXJuIHYueSA9PT0geSAmJiB2LnggPj0geCAmJiB2LnggPCB4ICsgbGVuZ3RoO1xuICAgICAgZWxzZSByZXR1cm4gdi54ID09PSB4ICYmIHYueSA+PSB5ICYmIHYueSA8IHkgKyBsZW5ndGg7XG4gICAgfSk7XG4gIH07XG5cbiAgbGV0IHJlc2V0SGl0cyA9ICgpID0+IChoaXRzLmxlbmd0aCA9IDApO1xuICByZXR1cm4ge1xuICAgIGdldExlbmd0aCxcbiAgICBnZXRPcmlnaW4sXG4gICAgc2V0T3JpZ2luLFxuICAgIGlzSG9yaXpvbnRhbCxcbiAgICBzZXRIb3Jpem9udGFsLFxuICAgIGhpdCxcbiAgICBpc1N1bmssXG4gICAgcmVzZXRIaXRzLFxuICB9O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIFNoaXBOYW1lcygpIHtcbiAgcmV0dXJuIHtcbiAgICBDYXJyaWVyOiAnQ2FycmllcicsXG4gICAgQmF0dGxlc2hpcDogJ0JhdHRsZXNoaXAnLFxuICAgIERlc3Ryb3llcjogJ0Rlc3Ryb3llcicsXG4gICAgU3VibWFyaW5lOiAnU3VibWFyaW5lJyxcbiAgICBQYXRyb2xCb2F0OiAnUGF0cm9sQm9hdCcsXG4gIH07XG59KSgpO1xuIiwiaW1wb3J0IFNoaXBOYW1lcyBmcm9tICcuL1NoaXBOYW1lcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoaXB5YXJkRGlzcGxheSB7XG4gIGNvbnN0cnVjdG9yKGNvbnRhaW5lcikge1xuICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuY2xhc3NMaXN0LmFkZCgnc2hpcHlhcmQnKTtcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gU2hpcE5hbWVzKSB7XG4gICAgICBsZXQgc2hpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgc2hpcC5jbGFzc0xpc3QuYWRkKG5hbWUpO1xuICAgICAgc2hpcC5pZCA9IG5hbWU7XG4gICAgICBzaGlwLmNsYXNzTGlzdC5hZGQoJ3NoaXAnKTtcbiAgICAgIHNoaXAuc3R5bGUuZ3JpZEFyZWEgPSBuYW1lO1xuICAgICAgc2hpcC5kcmFnZ2FibGUgPSB0cnVlO1xuICAgICAgc2hpcC5vbmRyYWdzdGFydCA9IChlKSA9PiB7XG4gICAgICAgIGUuZGF0YVRyYW5zZmVyLnNldERhdGEoXG4gICAgICAgICAgJ3RleHQnLFxuICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIGlkOiBlLnRhcmdldC5pZCxcbiAgICAgICAgICAgIG9mZnNldFg6IGUub2Zmc2V0WCxcbiAgICAgICAgICAgIG9mZnNldFk6IGUub2Zmc2V0WSxcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfTtcbiAgICAgIHNoaXAudGV4dENvbnRlbnQgPSBuYW1lO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKHNoaXApO1xuICAgIH1cbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgQm9hcmQgZnJvbSAnLi9Cb2FyZCc7XG5pbXBvcnQgRGlzcGxheUJvYXJkIGZyb20gJy4vRGlzcGxheUJvYXJkJztcbmltcG9ydCBTaGlweWFyZERpc3BsYXkgZnJvbSAnLi9TaGlweWFyZERpc3BsYXknO1xuXG5sZXQgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcicpO1xubGV0IG9wcG9uZW50ID0gbmV3IERpc3BsYXlCb2FyZChjb250YWluZXIpO1xubGV0IHBsYXllciA9IG5ldyBEaXNwbGF5Qm9hcmQoY29udGFpbmVyLCBCb2FyZCgxMCkpO1xubGV0IHNoaXB5YXJkID0gbmV3IFNoaXB5YXJkRGlzcGxheShjb250YWluZXIpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9