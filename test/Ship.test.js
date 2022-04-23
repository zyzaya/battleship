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
