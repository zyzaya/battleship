import Board from './Board';
import ShipNames from './ShipNames';

export default function Battleship(player1, player2) {
  let p1Board = Board(10);
  let p2Board = Board(10);
  /*
      players need to be able to access if the
      placement of a ship is valid.
      this function should be replaced with
      placeShip(name, x, y) and(?)
      isValidPlacement(name, x, y)
      ??????????????
      then player needs to be aware of Battleship
      or does it. the game does but the player doesn't
      ui.somebutton.onclick = () => placeShip(information)
    */

  let placeShip = function (name, x, y, isPlayer1) {
    if (isPlayer1) p1Board.placeShip(name, x, y);
    else p2Board.placeShip(name, x, y);
  };

  let start = function () {};

  return { placeShip };
}
