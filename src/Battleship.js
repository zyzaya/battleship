import Board from './Board';

export default function Battleship(player1, player2) {
  let p1Board = Board(10);
  let p2Board = Board(10);

  let placeShip = function (name, x, y, isPlayer1) {
    if (isPlayer1) p1Board.placeShip(name, x, y);
    else p2Board.placeShip(name, x, y);
  };

  let start = function () {};

  return { placeShip };
}
