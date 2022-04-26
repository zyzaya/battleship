import Battleship from '../src/Battleship';

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

it('ask for a guess from the current players turn', () => {
  let p1 = fakePlayer();
  let p2 = fakePlayer();
  let battleship = Battleship(p1, p2);
  battleship.start();
  expect(p1.getGuess).toHaveBeenCalled();
});
