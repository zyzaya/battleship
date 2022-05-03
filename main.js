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
        if (info != undefined) {
          let shipIcon = document.getElementById(name);
          let right = info.origin.x + 3;
          let bottom = info.origin.y + 3;
          if (info.horizontal) {
            right += info.length - 1;
            shipIcon.classList.remove('verticalShip');
            shipIcon.classList.add('horizontalShip');
          } else {
            bottom += info.length - 1;
            shipIcon.classList.remove('horizontalShip');
            shipIcon.classList.add('verticalShip');
          }

          shipIcon.style.gridArea = `
            ${info.origin.y + 2} / 
            ${info.origin.x + 2} / 
            ${bottom} / 
            ${right}`;
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
            board.removeShip(info.id);
            board.placeShip(info.id, originCoords.x, originCoords.y, false);
            draw();
          }
        };
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
  constructor(container, board) {
    let div = document.createElement('div');
    div.classList.add('shipyard');
    for (const name in _ShipNames__WEBPACK_IMPORTED_MODULE_0__["default"]) {
      let ship = document.createElement('div');
      ship.classList.add(name);
      ship.id = name;
      ship.classList.add('ship');
      ship.classList.add('verticalShip');
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
      ship.onclick = (e) => {
        let info = board.getShipInfo(name);
        if (info === undefined) return;
        console.log(info);
        board.placeShip(name, info.origin.x, info.origin.y, !info.horizontal);
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
let board = (0,_Board__WEBPACK_IMPORTED_MODULE_0__["default"])(10);
let player = new _DisplayBoard__WEBPACK_IMPORTED_MODULE_1__["default"](container, board);
let shipyard = new _ShipyardDisplay__WEBPACK_IMPORTED_MODULE_2__["default"](container, board);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7VUNuQ0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7O0FDTjRCO0FBQ2M7QUFDTTs7QUFFaEQ7QUFDQSxtQkFBbUIscURBQVk7QUFDL0IsWUFBWSxrREFBSztBQUNqQixpQkFBaUIscURBQVk7QUFDN0IsbUJBQW1CLHdEQUFlIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9Cb2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL0Rpc3BsYXlCb2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL1NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9TaGlwTmFtZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9TaGlweWFyZERpc3BsYXkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNoaXAgZnJvbSAnLi9TaGlwJztcbmltcG9ydCBTaGlwTmFtZXMgZnJvbSAnLi9TaGlwTmFtZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCb2FyZChzaXplKSB7XG4gIGxldCBzaGlwcyA9IHt9O1xuICBzaGlwc1tTaGlwTmFtZXMuQ2Fycmllcl0gPSBTaGlwKDUpO1xuICBzaGlwc1tTaGlwTmFtZXMuQmF0dGxlc2hpcF0gPSBTaGlwKDQpO1xuICBzaGlwc1tTaGlwTmFtZXMuRGVzdHJveWVyXSA9IFNoaXAoMyk7XG4gIHNoaXBzW1NoaXBOYW1lcy5TdWJtYXJpbmVdID0gU2hpcCgzKTtcbiAgc2hpcHNbU2hpcE5hbWVzLlBhdHJvbEJvYXRdID0gU2hpcCgyKTtcbiAgbGV0IHBsYWNlZFNoaXBzID0gW107XG4gIGxldCB2YWxpZGF0ZVNoaXBJbmZvID0gZnVuY3Rpb24gKG5hbWUsIHgsIHksIGhvcml6b250YWwpIHtcbiAgICBpZiAoc2hpcHNbbmFtZV0gPT09IHVuZGVmaW5lZClcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3I6IG5hbWUgbXVzdCBiZSBhIHZhbGlkIHNoaXAgbmFtZScpO1xuICAgIGlmICh4IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3ggbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gemVybycpO1xuICAgIGlmICh5IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3kgbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gemVybycpO1xuICAgIGlmIChob3Jpem9udGFsICYmIHggKyBzaGlwc1tuYW1lXS5nZXRMZW5ndGgoKSAtIDEgPj0gc2l6ZSlcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFxuICAgICAgICBgeCBtdXN0IGJlIGxlc3MgdGhhbiB0aGUgc2l6ZSBvZiB0aGUgYm9hcmQgKCR7c2l6ZX0pYFxuICAgICAgKTtcbiAgICBpZiAoIWhvcml6b250YWwgJiYgeSArIHNoaXBzW25hbWVdLmdldExlbmd0aCgpIC0gMSA+PSBzaXplKVxuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXG4gICAgICAgIGB5IG11c3QgYmUgbGVzcyB0aGFuIHRoZSBzaXplIG9mIHRoZSBib2FyZCAoJHtzaXplfSlgXG4gICAgICApO1xuICB9O1xuXG4gIGxldCBpc1ZhbGlkU2hpcFBsYWNlbWVudCA9IGZ1bmN0aW9uIChuYW1lLCB4LCB5LCBob3Jpem9udGFsKSB7XG4gICAgaWYgKHNoaXBzW25hbWVdID09PSB1bmRlZmluZWQpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yOiBuYW1lIG11c3QgYmUgYSB2YWxpZCBzaGlwIG5hbWUnKTtcbiAgICBsZXQgbGVmdCA9IHg7XG4gICAgbGV0IHRvcCA9IHk7XG4gICAgbGV0IHJpZ2h0ID0gaG9yaXpvbnRhbCA/IGxlZnQgKyBzaGlwc1tuYW1lXS5nZXRMZW5ndGgoKSAtIDEgOiBsZWZ0O1xuICAgIGxldCBib3R0b20gPSBob3Jpem9udGFsID8gdG9wIDogdG9wICsgc2hpcHNbbmFtZV0uZ2V0TGVuZ3RoKCkgLSAxO1xuICAgIHJldHVybiAhcGxhY2VkU2hpcHMuc29tZSgodmFsKSA9PiB7XG4gICAgICBpZiAodmFsICE9PSBuYW1lKSB7XG4gICAgICAgIGxldCBsID0gc2hpcHNbdmFsXS5nZXRPcmlnaW4oKS54O1xuICAgICAgICBsZXQgdCA9IHNoaXBzW3ZhbF0uZ2V0T3JpZ2luKCkueTtcbiAgICAgICAgbGV0IHIgPSBzaGlwc1t2YWxdLmlzSG9yaXpvbnRhbCgpID8gbCArIHNoaXBzW3ZhbF0uZ2V0TGVuZ3RoKCkgLSAxIDogbDtcbiAgICAgICAgbGV0IGIgPSBzaGlwc1t2YWxdLmlzSG9yaXpvbnRhbCgpID8gdCA6IHQgKyBzaGlwc1t2YWxdLmdldExlbmd0aCgpIC0gMTtcbiAgICAgICAgLy8gc2hpcHMgY29sbGlkZVxuICAgICAgICBpZiAoXG4gICAgICAgICAgKChsZWZ0ID49IGwgJiYgbGVmdCA8PSByKSB8fCAocmlnaHQgPj0gbCAmJiByaWdodCA8PSByKSkgJiZcbiAgICAgICAgICAoKHRvcCA+PSB0ICYmIHRvcCA8PSBiKSB8fCAoYm90dG9tID49IHQgJiYgYm90dG9tIDw9IGIpKVxuICAgICAgICApIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGxldCBwbGFjZVNoaXAgPSBmdW5jdGlvbiAobmFtZSwgeCwgeSwgaG9yaXpvbnRhbCkge1xuICAgIHZhbGlkYXRlU2hpcEluZm8obmFtZSwgeCwgeSwgaG9yaXpvbnRhbCk7XG4gICAgaWYgKCFpc1ZhbGlkU2hpcFBsYWNlbWVudChuYW1lLCB4LCB5LCBob3Jpem9udGFsKSkgcmV0dXJuIGZhbHNlO1xuICAgIHNoaXBzW25hbWVdLnNldE9yaWdpbih4LCB5KTtcbiAgICBzaGlwc1tuYW1lXS5zZXRIb3Jpem9udGFsKGhvcml6b250YWwpO1xuICAgIGlmICghcGxhY2VkU2hpcHMuaW5jbHVkZXMobmFtZSkpIHBsYWNlZFNoaXBzLnB1c2gobmFtZSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgbGV0IHJlbW92ZVNoaXAgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIGlmIChzaGlwc1tuYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvcjogbmFtZSBtdXN0IGJlIGEgdmFsaWQgc2hpcCBuYW1lJyk7XG4gICAgcGxhY2VkU2hpcHMgPSBwbGFjZWRTaGlwcy5maWx0ZXIoKHYpID0+IHYgIT09IG5hbWUpO1xuICAgIHNoaXBzW25hbWVdLnJlc2V0SGl0cygpO1xuICB9O1xuXG4gIGxldCBoaXQgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgIGZvciAoY29uc3QgbmFtZSBpbiBzaGlwcykge1xuICAgICAgaWYgKHBsYWNlZFNoaXBzLmluY2x1ZGVzKG5hbWUpICYmIHNoaXBzW25hbWVdLmhpdCh4LCB5KSkgcmV0dXJuIG5hbWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBsZXQgaXNTdW5rID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBpZiAoc2hpcHNbbmFtZV0gPT09IHVuZGVmaW5lZClcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3I6IG5hbWUgbXVzdCBiZSBhIHZhbGlkIHNoaXAgbmFtZScpO1xuICAgIHJldHVybiBzaGlwc1tuYW1lXS5pc1N1bmsoKTtcbiAgfTtcblxuICBsZXQgZ2V0U2hpcEluZm8gPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIGlmIChzaGlwc1tuYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvcjogbmFtZSBtdXN0IGJlIGEgdmFsaWQgc2hpcCBuYW1lJyk7XG4gICAgaWYgKCFwbGFjZWRTaGlwcy5pbmNsdWRlcyhuYW1lKSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICByZXR1cm4ge1xuICAgICAgb3JpZ2luOiBzaGlwc1tuYW1lXS5nZXRPcmlnaW4oKSxcbiAgICAgIGhvcml6b250YWw6IHNoaXBzW25hbWVdLmlzSG9yaXpvbnRhbCgpLFxuICAgICAgc3Vuazogc2hpcHNbbmFtZV0uaXNTdW5rKCksXG4gICAgICBsZW5ndGg6IHNoaXBzW25hbWVdLmdldExlbmd0aCgpLFxuICAgIH07XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBwbGFjZVNoaXAsXG4gICAgcmVtb3ZlU2hpcCxcbiAgICBoaXQsXG4gICAgaXNTdW5rLFxuICAgIGdldFNoaXBJbmZvLFxuICB9O1xufVxuIiwiaW1wb3J0IFNoaXBOYW1lcyBmcm9tICcuL1NoaXBOYW1lcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpc3BsYXlCb2FyZCB7XG4gIGNvbnN0cnVjdG9yKGNvbnRhaW5lciwgYm9hcmQpIHtcbiAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmNsYXNzTGlzdC5hZGQoJ2JvYXJkJyk7XG4gICAgbGV0IGRyYXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBmb3IgKGNvbnN0IG5hbWUgaW4gU2hpcE5hbWVzKSB7XG4gICAgICAgIGxldCBpbmZvID0gYm9hcmQuZ2V0U2hpcEluZm8obmFtZSk7XG4gICAgICAgIGlmIChpbmZvICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGxldCBzaGlwSWNvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5hbWUpO1xuICAgICAgICAgIGxldCByaWdodCA9IGluZm8ub3JpZ2luLnggKyAzO1xuICAgICAgICAgIGxldCBib3R0b20gPSBpbmZvLm9yaWdpbi55ICsgMztcbiAgICAgICAgICBpZiAoaW5mby5ob3Jpem9udGFsKSB7XG4gICAgICAgICAgICByaWdodCArPSBpbmZvLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICBzaGlwSWNvbi5jbGFzc0xpc3QucmVtb3ZlKCd2ZXJ0aWNhbFNoaXAnKTtcbiAgICAgICAgICAgIHNoaXBJY29uLmNsYXNzTGlzdC5hZGQoJ2hvcml6b250YWxTaGlwJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJvdHRvbSArPSBpbmZvLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICBzaGlwSWNvbi5jbGFzc0xpc3QucmVtb3ZlKCdob3Jpem9udGFsU2hpcCcpO1xuICAgICAgICAgICAgc2hpcEljb24uY2xhc3NMaXN0LmFkZCgndmVydGljYWxTaGlwJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc2hpcEljb24uc3R5bGUuZ3JpZEFyZWEgPSBgXG4gICAgICAgICAgICAke2luZm8ub3JpZ2luLnkgKyAyfSAvIFxuICAgICAgICAgICAgJHtpbmZvLm9yaWdpbi54ICsgMn0gLyBcbiAgICAgICAgICAgICR7Ym90dG9tfSAvIFxuICAgICAgICAgICAgJHtyaWdodH1gO1xuICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChzaGlwSWNvbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPCAxMTsgeSsrKSB7XG4gICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDExOyB4KyspIHtcbiAgICAgICAgbGV0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgY2VsbC5pZCA9IEpTT04uc3RyaW5naWZ5KHsgeDogeCAtIDEsIHk6IHkgLSAxIH0pO1xuICAgICAgICBjZWxsLnN0eWxlLmdyaWRBcmVhID0gYCR7eSArIDF9IC8gJHt4ICsgMX0gLyAke3kgKyAyfSAvICR7eCArIDJ9YDtcbiAgICAgICAgaWYgKHkgPT09IDAgJiYgeCA+IDApIHtcbiAgICAgICAgICBjZWxsLnRleHRDb250ZW50ID0gU3RyaW5nLmZyb21DaGFyQ29kZSg2NCArIHgpO1xuICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZCgnbGFiZWxDZWxsJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoeCA9PT0gMCAmJiB5ID4gMCkge1xuICAgICAgICAgIGNlbGwudGV4dENvbnRlbnQgPSB5LnRvU3RyaW5nKCk7XG4gICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKCdsYWJlbENlbGwnKTtcbiAgICAgICAgfSBlbHNlIGlmICh4ID4gMCAmJiB5ID4gMCkgY2VsbC5jbGFzc0xpc3QuYWRkKCdjZWxsJyk7XG5cbiAgICAgICAgY2VsbC5vbmRyYWdvdmVyID0gKGUpID0+IGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY2VsbC5vbmRyb3AgPSAoZSkgPT4ge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBsZXQgaW5mbyA9IEpTT04ucGFyc2UoZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgndGV4dCcpKTtcbiAgICAgICAgICBsZXQgb3JpZ2luID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChcbiAgICAgICAgICAgIGUueCAtIGUub2Zmc2V0WCAtIGluZm8ub2Zmc2V0WCArIDI1LFxuICAgICAgICAgICAgZS55IC0gZS5vZmZzZXRZIC0gaW5mby5vZmZzZXRZICsgMjVcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmIChvcmlnaW4uY2xhc3NMaXN0LmNvbnRhaW5zKCdjZWxsJykgJiYgZGl2LmNvbnRhaW5zKG9yaWdpbikpIHtcbiAgICAgICAgICAgIGxldCBvcmlnaW5Db29yZHMgPSBKU09OLnBhcnNlKG9yaWdpbi5pZCk7XG4gICAgICAgICAgICBib2FyZC5yZW1vdmVTaGlwKGluZm8uaWQpO1xuICAgICAgICAgICAgYm9hcmQucGxhY2VTaGlwKGluZm8uaWQsIG9yaWdpbkNvb3Jkcy54LCBvcmlnaW5Db29yZHMueSwgZmFsc2UpO1xuICAgICAgICAgICAgZHJhdygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKGNlbGwpO1xuICAgICAgfVxuICAgIH1cbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2hpcChsZW5ndGgpIHtcbiAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKGxlbmd0aCkpXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignbGVuZ3RoIG11c3QgYmUgYW4gaW50ZWdlcicpO1xuICBlbHNlIGlmIChsZW5ndGggPCAwKVxuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdTaGlwIGxlbmd0aCBjYW5ub3QgYmUgbGVzcyB0aGFuIHplcm8nKTtcbiAgbGV0IHggPSAwO1xuICBsZXQgeSA9IDA7XG4gIGxldCBob3Jpem9udGFsID0gZmFsc2U7XG4gIGxldCBoaXRzID0gW107XG5cbiAgbGV0IGdldExlbmd0aCA9ICgpID0+IHtcbiAgICByZXR1cm4gbGVuZ3RoO1xuICB9O1xuXG4gIGxldCBzZXRPcmlnaW4gPSAobmV3WCwgbmV3WSkgPT4ge1xuICAgIGlmICghTnVtYmVyLmlzSW50ZWdlcihuZXdYKSkgdGhyb3cgbmV3IFR5cGVFcnJvcigneCBtdXN0IGJlIGFuIGludGVnZXInKTtcbiAgICBlbHNlIGlmICghTnVtYmVyLmlzSW50ZWdlcihuZXdZKSlcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3kgbXVzdCBiZSBhbiBpbnRlZ2VyJyk7XG5cbiAgICB4ID0gbmV3WDtcbiAgICB5ID0gbmV3WTtcbiAgfTtcblxuICBsZXQgZ2V0T3JpZ2luID0gKCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICB4LFxuICAgICAgeSxcbiAgICB9O1xuICB9O1xuXG4gIGxldCBpc0hvcml6b250YWwgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGhvcml6b250YWw7XG4gIH07XG5cbiAgbGV0IHNldEhvcml6b250YWwgPSAodmFsdWUpID0+IHtcbiAgICBob3Jpem9udGFsID0gISF2YWx1ZTtcbiAgfTtcblxuICBsZXQgaGl0ID0gKHRhcmdldFgsIHRhcmdldFkpID0+IHtcbiAgICBpZiAoIU51bWJlci5pc0ludGVnZXIodGFyZ2V0WCkpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0YXJnZXRYIG11c3QgYmUgYW4gaW50ZWdlcicpO1xuICAgIGVsc2UgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKHRhcmdldFkpKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndGFyZ2V0WSBtdXN0IGJlIGFuIGludGVnZXInKTtcblxuICAgIGxldCBzdWNjZXNzID1cbiAgICAgIChob3Jpem9udGFsICYmIHkgPT09IHRhcmdldFkgJiYgdGFyZ2V0WCA+PSB4ICYmIHRhcmdldFggPCB4ICsgbGVuZ3RoKSB8fFxuICAgICAgKCFob3Jpem9udGFsICYmIHggPT09IHRhcmdldFggJiYgdGFyZ2V0WSA+PSB5ICYmIHRhcmdldFkgPCB5ICsgbGVuZ3RoKTtcbiAgICBpZiAoc3VjY2VzcykgaGl0cy5wdXNoKHsgeDogdGFyZ2V0WCwgeTogdGFyZ2V0WSB9KTtcbiAgICByZXR1cm4gc3VjY2VzcztcbiAgfTtcblxuICBsZXQgaXNTdW5rID0gKCkgPT4ge1xuICAgIGlmIChoaXRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiBoaXRzLmV2ZXJ5KCh2KSA9PiB7XG4gICAgICBpZiAoaG9yaXpvbnRhbCkgcmV0dXJuIHYueSA9PT0geSAmJiB2LnggPj0geCAmJiB2LnggPCB4ICsgbGVuZ3RoO1xuICAgICAgZWxzZSByZXR1cm4gdi54ID09PSB4ICYmIHYueSA+PSB5ICYmIHYueSA8IHkgKyBsZW5ndGg7XG4gICAgfSk7XG4gIH07XG5cbiAgbGV0IHJlc2V0SGl0cyA9ICgpID0+IChoaXRzLmxlbmd0aCA9IDApO1xuICByZXR1cm4ge1xuICAgIGdldExlbmd0aCxcbiAgICBnZXRPcmlnaW4sXG4gICAgc2V0T3JpZ2luLFxuICAgIGlzSG9yaXpvbnRhbCxcbiAgICBzZXRIb3Jpem9udGFsLFxuICAgIGhpdCxcbiAgICBpc1N1bmssXG4gICAgcmVzZXRIaXRzLFxuICB9O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIFNoaXBOYW1lcygpIHtcbiAgcmV0dXJuIHtcbiAgICBDYXJyaWVyOiAnQ2FycmllcicsXG4gICAgQmF0dGxlc2hpcDogJ0JhdHRsZXNoaXAnLFxuICAgIERlc3Ryb3llcjogJ0Rlc3Ryb3llcicsXG4gICAgU3VibWFyaW5lOiAnU3VibWFyaW5lJyxcbiAgICBQYXRyb2xCb2F0OiAnUGF0cm9sQm9hdCcsXG4gIH07XG59KSgpO1xuIiwiaW1wb3J0IFNoaXBOYW1lcyBmcm9tICcuL1NoaXBOYW1lcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoaXB5YXJkRGlzcGxheSB7XG4gIGNvbnN0cnVjdG9yKGNvbnRhaW5lciwgYm9hcmQpIHtcbiAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmNsYXNzTGlzdC5hZGQoJ3NoaXB5YXJkJyk7XG4gICAgZm9yIChjb25zdCBuYW1lIGluIFNoaXBOYW1lcykge1xuICAgICAgbGV0IHNoaXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHNoaXAuY2xhc3NMaXN0LmFkZChuYW1lKTtcbiAgICAgIHNoaXAuaWQgPSBuYW1lO1xuICAgICAgc2hpcC5jbGFzc0xpc3QuYWRkKCdzaGlwJyk7XG4gICAgICBzaGlwLmNsYXNzTGlzdC5hZGQoJ3ZlcnRpY2FsU2hpcCcpO1xuICAgICAgc2hpcC5zdHlsZS5ncmlkQXJlYSA9IG5hbWU7XG4gICAgICBzaGlwLmRyYWdnYWJsZSA9IHRydWU7XG4gICAgICBzaGlwLm9uZHJhZ3N0YXJ0ID0gKGUpID0+IHtcbiAgICAgICAgZS5kYXRhVHJhbnNmZXIuc2V0RGF0YShcbiAgICAgICAgICAndGV4dCcsXG4gICAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgaWQ6IGUudGFyZ2V0LmlkLFxuICAgICAgICAgICAgb2Zmc2V0WDogZS5vZmZzZXRYLFxuICAgICAgICAgICAgb2Zmc2V0WTogZS5vZmZzZXRZLFxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9O1xuICAgICAgc2hpcC5vbmNsaWNrID0gKGUpID0+IHtcbiAgICAgICAgbGV0IGluZm8gPSBib2FyZC5nZXRTaGlwSW5mbyhuYW1lKTtcbiAgICAgICAgaWYgKGluZm8gPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgICAgICBjb25zb2xlLmxvZyhpbmZvKTtcbiAgICAgICAgYm9hcmQucGxhY2VTaGlwKG5hbWUsIGluZm8ub3JpZ2luLngsIGluZm8ub3JpZ2luLnksICFpbmZvLmhvcml6b250YWwpO1xuICAgICAgfTtcbiAgICAgIHNoaXAudGV4dENvbnRlbnQgPSBuYW1lO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKHNoaXApO1xuICAgIH1cbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgQm9hcmQgZnJvbSAnLi9Cb2FyZCc7XG5pbXBvcnQgRGlzcGxheUJvYXJkIGZyb20gJy4vRGlzcGxheUJvYXJkJztcbmltcG9ydCBTaGlweWFyZERpc3BsYXkgZnJvbSAnLi9TaGlweWFyZERpc3BsYXknO1xuXG5sZXQgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcicpO1xubGV0IG9wcG9uZW50ID0gbmV3IERpc3BsYXlCb2FyZChjb250YWluZXIpO1xubGV0IGJvYXJkID0gQm9hcmQoMTApO1xubGV0IHBsYXllciA9IG5ldyBEaXNwbGF5Qm9hcmQoY29udGFpbmVyLCBib2FyZCk7XG5sZXQgc2hpcHlhcmQgPSBuZXcgU2hpcHlhcmREaXNwbGF5KGNvbnRhaW5lciwgYm9hcmQpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9