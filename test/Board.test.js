import ShipNames from '../src/ShipNames';
import Board from './../src/Board';

it('places a ship horizontally', () => {
  let board = Board(10);
  board.placeShip(ShipNames.Carrier, 1, 1, true);
  expect(board.hit(1, 1)).toBe(ShipNames.Carrier);
});

it('places a ship vertically', () => {
  let board = Board(10);
  board.placeShip(ShipNames.Carrier, 1, 1, false);
  expect(board.hit(1, 2)).toBe(ShipNames.Carrier);
});

it('does not allow a ship to be placed off of the board', () => {
  let board = Board(10);
  expect(() => board.placeShip(ShipNames.Carrier, 7, 2, true)).toThrowError(
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
  expect(board.hit(0, 0)).toBe(false);
});

it('can miss a placed ship', () => {
  let board = Board(10);
  board.placeShip(ShipNames.Carrier, 1, 2, true);
  expect(board.hit(0, 2)).toBe(false);
});

it('cannot place a ship on the location of another ship', () => {
  let board = Board(10);
  board.placeShip(ShipNames.Carrier, 3, 2, true);
  expect(board.placeShip(ShipNames.Destroyer, 4, 0, false)).toBe(false);
});

it('can remove a ship', () => {
  let board = Board(10);
  board.placeShip(ShipNames.PatrolBoat, 8, 8, true);
  expect(board.hit(9, 8)).not.toBe(true);
  board.removeShip(ShipNames.PatrolBoat);
  expect(board.hit(9, 8)).toBe(false);
});

it('can determine a ship has not sunk', () => {
  let board = Board(10);
  board.placeShip(ShipNames.PatrolBoat, 1, 1, true);
  expect(board.isSunk(ShipNames.PatrolBoat)).toBe(false);
});

it('can detrmine a ship has been sunk', () => {
  let board = Board(10);
  board.placeShip(ShipNames.PatrolBoat, 1, 1, true);
  board.hit(1, 1);
  board.hit(2, 1);
  expect(board.isSunk(ShipNames.PatrolBoat)).toBe(true);
});

it('does not allow an invalid ship name for isSunk', () => {
  let board = Board(10);
  expect(() => board.isSunk('notavalidshipname')).toThrowError(
    'valid ship name'
  );
});

it('can retrieve accurate info of a ship', () => {
  let board = Board(10);
  board.placeShip(ShipNames.PatrolBoat, 2, 3, false);
  let info = board.getShipInfo(ShipNames.PatrolBoat);
  expect(info.origin.x).toBe(2);
  expect(info.origin.y).toBe(3);
  expect(info.horizontal).toBe(false);
  expect(info.sunk).toBe(false);
});
