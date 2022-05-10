import Board from './Board';

export default function Battleship(player1, player2) {
  let size = 10;
  let p1Board = Board(size);
  let p2Board = Board(size);
  let isP1Turn = true;
  let onDraw = {};

  let isValidGuess = function (x, y) {
    return x >= 0 && x < size && y >= 0 && y < size;
  };

  let placeShip = function (name, x, y, horizontal, isPlayer1) {
    if (isPlayer1 && p1Board.isValidShipPlacement(name, x, y, horizontal))
      p1Board.placeShip(name, x, y, horizontal);
    else if (p2Board.isValidShipPlacement(name, x, y, horizontal))
      p2Board.placeShip(name, x, y);
  };

  let getShipInfo = function (name, isPlayer1) {
    return isPlayer1 ? p1Board.getShipInfo(name) : p2Board.getShipInfo(name);
  };

  let nextTurn = async function () {
    let currentBoard = isP1Turn ? p1Board : p2Board;
    let currentPlayer = isP1Turn ? player1 : player2;
    let guess = await currentPlayer.getGuess();
    if (!isValidGuess(guess.x, guess.y))
      throw new RangeError(
        `Player ${isP1Turn ? '1' : '2'} guess is invalid. (${guess})`
      );

    currentBoard.hit(guess.x, guess.y);
    if (onDraw instanceof Function) onDraw();
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
  return { placeShip, getShipInfo, start, onDraw };
}
