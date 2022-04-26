import Battleship from '../src/Battleship';
import ShipNames from '../src/ShipNames';

let fakePlayer = function () {
  return {
    getShipPosition: jest.fn(() => {
      return { x: 0, y: 0 };
    }),
    getGuess: jest.fn(() => {
      return { x: 0, y: 0 };
    }),
    draw: jest.fn(),
  };
};

it("gets each player's ship positions", () => {
  let p1 = fakePlayer();
  let p2 = fakePlayer();
  let battleship = Battleship(p1, p2);
  battleship.setup();
  for (const name in ShipNames) {
    expect(p1.getShipPosition).toHaveBeenCalledWith(name);
    expect(p2.getShipPosition).toHaveBeenCalledWith(name);
  }
});

it('ask for a guess from the current players turn', () => {
  let p1 = fakePlayer();
  let p2 = fakePlayer();
  let battleship = Battleship(p1, p2);
  battleship.start();
  expect(p1.getGuess).toHaveBeenCalled();
});
