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
