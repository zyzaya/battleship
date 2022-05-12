import Board from './Board';
import ShipNames from './ShipNames';

export default function SimpleAI() {
  let guess = undefined;
  let history = [];
  let ships = {};

  let getRandomPosition = function () {
    let min = 0;
    let max = 10;
    return {
      x: Math.floor(Math.random() * (max - min + 1)) + min,
      y: Math.floor(Math.random() * (max - min + 1)) + min,
      horizontal: Math.random < 0.5,
    };
  };

  let shuffleShipPositions = function () {
    let board = Board(10);

    for (const name in ShipNames) {
      let pos = getRandomPosition();
      while (!board.validateShipInfo(name, pos.x, pos.y, pos.horizontal)) {
        pos = getRandomPosition();
      }
      ships[name] = pos;
    }
  };

  let getShipPosition = function () {};

  let getGuess = function () {};

  let getHistory = function () {
    return [...history];
  };

  shuffleShipPositions();
  return { getGuess, getHistory, getShipPosition, shuffleShipPositions };
}
