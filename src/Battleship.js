import Board from './Board';
import ShipNames from './ShipNames';

export default function Battleship(player1, player2) {
  let p1Board = Board(10);
  let p2Board = Board(10);

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
