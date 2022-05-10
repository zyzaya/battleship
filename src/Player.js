export default function Player() {
  let guess = undefined;

  let getGuess = async function () {
    while (guess === undefined) {
      await new Promise((resolve) => {
        setTimeout(() => resolve(), 50);
      });
    }
    // if there is a guess return it. otherwise wait for one.
    let ret = { x: guess.x, y: guess.y };
    guess = undefined;
    return ret;
  };

  let setGuess = function (x, y) {
    guess = { x: x, y: y };
  };

  return { getGuess, setGuess };
}
