import Battleship from './Battleship';
import Display from './Display';
import Player from './Player';
import SimpleAI from './SimpleAI';

let container = document.getElementById('container');
let player = Player();
let opponent = SimpleAI();
let battleship = Battleship(player, opponent);
let display = Display(battleship, player, opponent, container);
battleship.onDraw = () => {
  display.draw();
};
battleship.onGameEnd = () => {
  display.endGame();
};
