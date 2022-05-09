import Board from './Board';
import ShipNames from './ShipNames';

export default function Battleship(player1, player2) {
  let p1Board = Board(10);
  let p2Board = Board(10);
  let isP1Turn = true;

  let placeShip = function (name, x, y, horizontal, isPlayer1) {
    if (isPlayer1 && p1Board.isValidShipPlacement(name, x, y, horizontal))
      p1Board.placeShip(name, x, y, horizontal);
    else if (p2Board.isValidShipPlacement(name, x, y, horizontal))
      p2Board.placeShip(name, x, y);
  };

  let getShipInfo = function (name, isPlayer1) {
    return isPlayer1 ? p1Board.getShipInfo(name) : p2Board.getShipInfo(name);
  };

  let nextTurn = function () {
    // let guess = isP1Turn ? player1.getGuess() : player2.getGuess();
    // throw error if invalid guess
    // p1Board.hit(guess.x, guess.y);
    // draw();
    // if (isWinner()) endGame();
    // else {
    //   isP1Turn = !isP1Turn;
    //   nextTurn();
    // }
  };

  let start = function () {
    isP1Turn = true;
    nextTurn();
  };

  return { placeShip, getShipInfo };
}
