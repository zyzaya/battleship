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
  expect(() => board.placeShip(board.Carrier, 7, 2, true)).toThrowError(
    RangeError
  );
});

it('does not allow an invalid ship name', () => {
  let board = Board(10);
  expect(() => board.placeShip('notaship', 2, 2, false)).toThrowError(
    'valid ship name'
  );
});

it('cannot his a ship that has not been placed', () => {
  let board = Board(10);
  expect(board.isHit(0, 0)).toBe(false);
});

it('can miss a placed ship', () => {
  let board = Board(10);
  board.placeShip(board.Carrier, 1, 2, true);
  expect(board.isHit(0, 2)).toBe(false);
});

it('cannot place a ship on the location of another ship', () => {
  let board = Board(10);
  board.placeShip(board.Carrier, 3, 2, true);
  expect(board.placeShip(board.Destroyer, 4, 0, false)).toBe(false);
});

it('can remove a ship', () => {
  let board = Board(10);
  board.placeShip(board.PatrolBoat, 8, 8, true);
  expect(board.isHit(9, 8)).not.toBe(true);
  board.removeShip(board.PatrolBoat);
  expect(board.isHit(9, 8)).toBe(false);
});

it('can determine a ship has not sunk', () => {
  let board = Board(10);
  board.placeShip(board.PatrolBoat, 1, 1, true);
  expect(board.isSunk(board.PatrolBoat)).toBe(false);
});

it('can detrmine a ship has been sunk', () => {
  let board = Board(10);
  board.placeShip(board.PatrolBoat, 1, 1, true);
  board.isHit(1, 1);
  board.isHit(2, 1);
  expect(board.isSunk(board.PatrolBoat)).toBe(true);
});

it('does not allow an invalid ship name for isSunk', () => {
  let board = Board(10);
  expect(() => board.isSunk('notavalidshipname')).toThrowError(
    'valid ship name'
  );
});
