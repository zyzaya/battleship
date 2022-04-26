import Board from './Board';
import ShipNames from './ShipNames';

export default function Battleship(player1, player2) {
  let p1Board = Board(10);
  let p2Board = Board(10);

  let setup = function () {
    for (const name in ShipNames) {
      let p1Origin = player1.getShipPosition(name);
      p1Board.placeShip(name, p1Origin.x, p1Origin.y);
      let p2Origin = player2.getShipPosition(name);
      p2Board.placeShip(name, p2Origin.x, p2Origin.y);
    }
    // for each name in ship names call p1 and p2.getShipPosition
  };

  return { setup };
}
