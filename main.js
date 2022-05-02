/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

    for (let y = 0; y < 11; y++) {
      for (let x = 0; x < 11; x++) {
        let cell = document.createElement('div');
        cell.id = JSON.stringify({ x: x - 1, y: y - 1 });
        if (y === 0 && x > 0) {
          cell.textContent = String.fromCharCode(64 + x);
          cell.classList.add('labelCell');
        } else if (x === 0 && y > 0) {
          cell.textContent = y.toString();
          cell.classList.add('labelCell');
        } else if (x > 0 && y > 0) cell.classList.add('cell');
        cell.ondragover = (e) => {
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
            // draw();
            // remove ship
            // place ship
            // draw
            // console.log(originCoords);
            // cell.style.backgroundColor = 'red';
            // origin.style.backgroundColor = 'blue';
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

  draw() {
    for (const name in _ShipNames__WEBPACK_IMPORTED_MODULE_0__["default"]) {
      // get info (origin, horizontal, sunk)
      // hide all cells where ship is to be placed?
      // add shipyard element to grid div
      //
    }
  }
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
/* harmony import */ var _DisplayBoard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DisplayBoard */ "./src/DisplayBoard.js");
/* harmony import */ var _ShipyardDisplay__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ShipyardDisplay */ "./src/ShipyardDisplay.js");



let container = document.getElementById('container');
let opponent = new _DisplayBoard__WEBPACK_IMPORTED_MODULE_0__["default"](container);
let player = new _DisplayBoard__WEBPACK_IMPORTED_MODULE_0__["default"](container);
let shipyard = new _ShipyardDisplay__WEBPACK_IMPORTED_MODULE_1__["default"](container);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBb0M7O0FBRXJCO0FBQ2Y7QUFDQTtBQUNBOztBQUVBLG9CQUFvQixRQUFRO0FBQzVCLHNCQUFzQixRQUFRO0FBQzlCO0FBQ0EsbUNBQW1DLG9CQUFvQjtBQUN2RDtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx1QkFBdUIsa0RBQVM7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ2xFQSxpRUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxHQUFHLEVBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUNSK0I7O0FBRXJCO0FBQ2Y7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGtEQUFTO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7VUM1QkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNOMEM7QUFDTTs7QUFFaEQ7QUFDQSxtQkFBbUIscURBQVk7QUFDL0IsaUJBQWlCLHFEQUFZO0FBQzdCLG1CQUFtQix3REFBZSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvRGlzcGxheUJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvU2hpcE5hbWVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvU2hpcHlhcmREaXNwbGF5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTaGlwTmFtZXMgZnJvbSAnLi9TaGlwTmFtZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEaXNwbGF5Qm9hcmQge1xuICBjb25zdHJ1Y3Rvcihjb250YWluZXIsIGJvYXJkKSB7XG4gICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdib2FyZCcpO1xuXG4gICAgZm9yIChsZXQgeSA9IDA7IHkgPCAxMTsgeSsrKSB7XG4gICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDExOyB4KyspIHtcbiAgICAgICAgbGV0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgY2VsbC5pZCA9IEpTT04uc3RyaW5naWZ5KHsgeDogeCAtIDEsIHk6IHkgLSAxIH0pO1xuICAgICAgICBpZiAoeSA9PT0gMCAmJiB4ID4gMCkge1xuICAgICAgICAgIGNlbGwudGV4dENvbnRlbnQgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDY0ICsgeCk7XG4gICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKCdsYWJlbENlbGwnKTtcbiAgICAgICAgfSBlbHNlIGlmICh4ID09PSAwICYmIHkgPiAwKSB7XG4gICAgICAgICAgY2VsbC50ZXh0Q29udGVudCA9IHkudG9TdHJpbmcoKTtcbiAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ2xhYmVsQ2VsbCcpO1xuICAgICAgICB9IGVsc2UgaWYgKHggPiAwICYmIHkgPiAwKSBjZWxsLmNsYXNzTGlzdC5hZGQoJ2NlbGwnKTtcbiAgICAgICAgY2VsbC5vbmRyYWdvdmVyID0gKGUpID0+IHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgbGV0IGluZm8gPSBKU09OLnBhcnNlKGUuZGF0YVRyYW5zZmVyLmdldERhdGEoJ3RleHQnKSk7XG4gICAgICAgICAgbGV0IG9yaWdpbiA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoXG4gICAgICAgICAgICBlLnggLSBlLm9mZnNldFggLSBpbmZvLm9mZnNldFggKyAyNSxcbiAgICAgICAgICAgIGUueSAtIGUub2Zmc2V0WSAtIGluZm8ub2Zmc2V0WSArIDI1XG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAob3JpZ2luLmNsYXNzTGlzdC5jb250YWlucygnY2VsbCcpICYmIGRpdi5jb250YWlucyhvcmlnaW4pKSB7XG4gICAgICAgICAgICBsZXQgb3JpZ2luQ29vcmRzID0gSlNPTi5wYXJzZShvcmlnaW4uaWQpO1xuICAgICAgICAgICAgYm9hcmQucmVtb3ZlU2hpcChpbmZvLmlkKTtcbiAgICAgICAgICAgIGJvYXJkLnBsYWNlU2hpcChpbmZvLmlkLCBvcmlnaW5Db29yZHMueCwgb3JpZ2luQ29vcmRzLnksIGZhbHNlKTtcbiAgICAgICAgICAgIC8vIGRyYXcoKTtcbiAgICAgICAgICAgIC8vIHJlbW92ZSBzaGlwXG4gICAgICAgICAgICAvLyBwbGFjZSBzaGlwXG4gICAgICAgICAgICAvLyBkcmF3XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhvcmlnaW5Db29yZHMpO1xuICAgICAgICAgICAgLy8gY2VsbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmVkJztcbiAgICAgICAgICAgIC8vIG9yaWdpbi5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnYmx1ZSc7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICAvLyBjZWxsLm9uZHJvcCA9IChlKSA9PiB7XG4gICAgICAgIC8vICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAvLyAgIGxldCBpbmZvID0gSlNPTi5wYXJzZShlLmRhdGFUcmFuc2Zlci5nZXREYXRhKCd0ZXh0JykpO1xuICAgICAgICAvLyAgIGxldCBvcmlnaW4gPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KFxuICAgICAgICAvLyAgICAgZS54IC0gZS5vZmZzZXRYIC0gaW5mby5vZmZzZXRYICsgMjUsXG4gICAgICAgIC8vICAgICBlLnkgLSBlLm9mZnNldFkgLSBpbmZvLm9mZnNldFkgKyAyNVxuICAgICAgICAvLyAgICk7XG4gICAgICAgIC8vICAgaWYgKG9yaWdpbi5jbGFzc0xpc3QuY29udGFpbnMoJ2NlbGwnKSAmJiBkaXYuY29udGFpbnMob3JpZ2luKSkge1xuICAgICAgICAvLyAgICAgbGV0IG9yaWdpbkNvb3JkcyA9IEpTT04ucGFyc2Uob3JpZ2luLmlkKTtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKG9yaWdpbkNvb3Jkcyk7XG4gICAgICAgIC8vICAgICBjZWxsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdyZWQnO1xuICAgICAgICAvLyAgICAgb3JpZ2luLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdibHVlJztcbiAgICAgICAgLy8gICB9XG4gICAgICAgIC8vIH07XG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChjZWxsKTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRpdik7XG4gIH1cblxuICBkcmF3KCkge1xuICAgIGZvciAoY29uc3QgbmFtZSBpbiBTaGlwTmFtZXMpIHtcbiAgICAgIC8vIGdldCBpbmZvIChvcmlnaW4sIGhvcml6b250YWwsIHN1bmspXG4gICAgICAvLyBoaWRlIGFsbCBjZWxscyB3aGVyZSBzaGlwIGlzIHRvIGJlIHBsYWNlZD9cbiAgICAgIC8vIGFkZCBzaGlweWFyZCBlbGVtZW50IHRvIGdyaWQgZGl2XG4gICAgICAvL1xuICAgIH1cbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgKGZ1bmN0aW9uIFNoaXBOYW1lcygpIHtcbiAgcmV0dXJuIHtcbiAgICBDYXJyaWVyOiAnQ2FycmllcicsXG4gICAgQmF0dGxlc2hpcDogJ0JhdHRsZXNoaXAnLFxuICAgIERlc3Ryb3llcjogJ0Rlc3Ryb3llcicsXG4gICAgU3VibWFyaW5lOiAnU3VibWFyaW5lJyxcbiAgICBQYXRyb2xCb2F0OiAnUGF0cm9sQm9hdCcsXG4gIH07XG59KSgpO1xuIiwiaW1wb3J0IFNoaXBOYW1lcyBmcm9tICcuL1NoaXBOYW1lcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoaXB5YXJkRGlzcGxheSB7XG4gIGNvbnN0cnVjdG9yKGNvbnRhaW5lcikge1xuICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuY2xhc3NMaXN0LmFkZCgnc2hpcHlhcmQnKTtcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gU2hpcE5hbWVzKSB7XG4gICAgICBsZXQgc2hpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgc2hpcC5jbGFzc0xpc3QuYWRkKG5hbWUpO1xuICAgICAgc2hpcC5pZCA9IG5hbWU7XG4gICAgICBzaGlwLmNsYXNzTGlzdC5hZGQoJ3NoaXAnKTtcbiAgICAgIHNoaXAuc3R5bGUuZ3JpZEFyZWEgPSBuYW1lO1xuICAgICAgc2hpcC5kcmFnZ2FibGUgPSB0cnVlO1xuICAgICAgc2hpcC5vbmRyYWdzdGFydCA9IChlKSA9PiB7XG4gICAgICAgIGUuZGF0YVRyYW5zZmVyLnNldERhdGEoXG4gICAgICAgICAgJ3RleHQnLFxuICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIGlkOiBlLnRhcmdldC5pZCxcbiAgICAgICAgICAgIG9mZnNldFg6IGUub2Zmc2V0WCxcbiAgICAgICAgICAgIG9mZnNldFk6IGUub2Zmc2V0WSxcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfTtcbiAgICAgIHNoaXAudGV4dENvbnRlbnQgPSBuYW1lO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKHNoaXApO1xuICAgIH1cbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgRGlzcGxheUJvYXJkIGZyb20gJy4vRGlzcGxheUJvYXJkJztcbmltcG9ydCBTaGlweWFyZERpc3BsYXkgZnJvbSAnLi9TaGlweWFyZERpc3BsYXknO1xuXG5sZXQgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRhaW5lcicpO1xubGV0IG9wcG9uZW50ID0gbmV3IERpc3BsYXlCb2FyZChjb250YWluZXIpO1xubGV0IHBsYXllciA9IG5ldyBEaXNwbGF5Qm9hcmQoY29udGFpbmVyKTtcbmxldCBzaGlweWFyZCA9IG5ldyBTaGlweWFyZERpc3BsYXkoY29udGFpbmVyKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==