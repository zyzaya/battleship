export default function SimpleAI() {
  let guess = undefined;
  let history = [];

  let shuffleShipPosition = function () {};

  let getShipPosition = function () {};

  let getGuess = function () {};

  let getHistory = function () {
    return [...history];
  };

  shuffleShipPosition();
  return { getGuess, getHistory, getShipPosition, shuffleShipPosition };
}
