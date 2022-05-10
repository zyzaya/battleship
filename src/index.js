import Battleship from './Battleship';
import Display from './Display';
import Player from './Player';

let container = document.getElementById('container');
// let opponent = new DisplayBoard(container);
// let board = Board(10);
// let player = new DisplayBoard(container, board);
// let shipyard = new ShipyardDisplay(container, board);
Display(Battleship(Player(), Player()), container);

// let finish = false;
// let getGuess = async function (i) {
//   while (!finish) {
//     i = i + 1;
//     console.log(i);
//     await new Promise((resolve) => {
//       setTimeout(() => resolve(i), 1000);
//     });
//   }
//   return i;
// };

// let count = function (i) {
//   console.log(i);
//   if (!finish) setTimeout(count, 500, i + 1);
// };
// let start = document.getElementById('start');
// start.onclick = async function () {
//   let a = await getGuess(1);
//   console.log(`Finish: ${a}`);
// };
// let stop = document.getElementById('stop');
// stop.onclick = () => {
//   finish = true;
// };
