import Ship from './../src/Ship.js';

it('sets a length in a construction', () => {
  let ship = Ship(5);
  console.log(ship);
  expect(ship.getLength()).toBe(5);
});
