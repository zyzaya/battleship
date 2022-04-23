import Ship from './../src/Ship.js';

it('sets a length in a construction', () => {
  let ship = Ship(5);
  expect(ship.getLength()).toBe(5);
});

it('cannot have a negative length', () => {
  expect(() => Ship(-5)).toThrowError();
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
