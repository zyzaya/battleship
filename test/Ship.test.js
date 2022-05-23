import Ship from './../src/Ship';

it('sets a length in a construction', () => {
  let ship = Ship(5);
  expect(ship.getLength()).toBe(5);
});

it('must have a postive integer as a length', () => {
  expect(() => Ship(-5)).toThrowError();
  expect(() => Ship('length')).toThrowError();
});

it('has an origin', () => {
  let ship = Ship(5);
  expect(ship.getOrigin().x).toBeDefined();
  expect(ship.getOrigin().y).toBeDefined();
});

it('only accepts integer values as an origin', () => {
  let ship = Ship(5);
  expect(() => ship.setOrigin('x, y')).toThrowError();
});

it('can set the origin', () => {
  let ship = Ship(5);
  ship.setOrigin(6, 8);
  expect(ship.getOrigin().x).toBe(6);
  expect(ship.getOrigin().y).toBe(8);
});

it('has an orientation', () => {
  let ship = Ship(5);
  expect(ship.isHorizontal()).toBeDefined();
});

it('can set the orientation', () => {
  let ship = Ship(5);
  ship.setHorizontal(false);
  expect(ship.isHorizontal()).toBe(false);
});

it('can be hit when horizontal', () => {
  let ship = Ship(5);
  // 3 4 5 6 7
  ship.setOrigin(3, -5);
  ship.setHorizontal(true);
  expect(ship.hit(5, -5)).toBe(true);
});

it('can be hit when vertical', () => {
  let ship = Ship(3);
  // 10
  // 11
  // 12
  ship.setOrigin(-7, 10);
  ship.setHorizontal(false);
  expect(ship.hit(-7, 12)).toBe(true);
});

it('can be missed', () => {
  let ship = Ship(5);
  ship.setOrigin(3, -5);
  expect(ship.hit(3, 8)).toBe(false);
});

it('only accepts integer values as hit coordinates', () => {
  let ship = Ship(5);
  expect(() => ship.hit('5, 6')).toThrowError();
});

it('can be sunk when horizontal', () => {
  let ship = Ship(3);
  ship.setOrigin(3, -5);
  ship.setHorizontal(true);
  expect(ship.isSunk()).toBe(false);
  ship.hit(3, -5);
  ship.hit(4, -5);
  ship.hit(5, -5);
  expect(ship.isSunk()).toBe(true);
});

it('can be sunk when vertical', () => {
  let ship = Ship(4);
  ship.setOrigin(-1, 6);
  ship.setHorizontal(false);
  expect(ship.isSunk()).toBe(false);
  ship.hit(-1, 6);
  ship.hit(-1, 7);
  ship.hit(-1, 8);
  ship.hit(-1, 9);
  expect(ship.isSunk()).toBe(true);
});

it('is not hit when only hit once', () => {
  let ship = Ship(4);
  ship.setOrigin(-1, 6);
  ship.setHorizontal(false);
  expect(ship.isSunk()).toBe(false);
  ship.hit(-1, 6);
  expect(ship.isSunk()).toBe(false);
});

it('can clear hits', () => {
  let ship = Ship(3);
  ship.setOrigin(3, -5);
  ship.setHorizontal(true);
  expect(ship.isSunk()).toBe(false);
  ship.hit(3, -5);
  ship.hit(4, -5);
  ship.hit(5, -5);
  expect(ship.isSunk()).toBe(true);
  ship.resetHits();
  expect(ship.isSunk()).toBe(false);
});
