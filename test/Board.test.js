import Board from './../src/Board';

it('places a ship horizontally', () => {
  let board = Board(10);
  board.placeShip(board.Carrier, 1, 1, true);
  expect(board.isHit(1, 1)).toBe(board.Carrier);
});

it('places a ship vertically', () => {
  let board = Board(10);
  board.placeShip(board.Carrier, 1, 1, false);
  expect(board.isHit(1, 2)).toBe(board.Carrier);
});

it('does not allow a ship to be placed off of the board', () => {
  let board = Board(10);
  expect(() => board.placeShip(board.Carrier, 7, 2, true)).toThrowError();
});

it('does not allow an invalid ship name', () => {
  let board = Board(10);
  expect(() => board.placeShip('notaship', 2, 2, false)).toThrowError();
});

it('cannot his a ship that has not been placed', () => {
  let board = Board(10);
  expect(board.isHit(0, 0)).toBe(false);
});
