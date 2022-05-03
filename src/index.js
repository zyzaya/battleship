import Battleship from './Battleship';
import Board from './Board';
import Display from './Display';
import DisplayBoard from './DisplayBoard';
import ShipyardDisplay from './Shipyard';

let container = document.getElementById('container');
// let opponent = new DisplayBoard(container);
// let board = Board(10);
// let player = new DisplayBoard(container, board);
// let shipyard = new ShipyardDisplay(container, board);
let display = Display(new Battleship(), container);
