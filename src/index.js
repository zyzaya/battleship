import Board from './Board';
import DisplayBoard from './DisplayBoard';
import ShipyardDisplay from './ShipyardDisplay';

let container = document.getElementById('container');
let opponent = new DisplayBoard(container);
let board = Board(10);
let player = new DisplayBoard(container, board);
let shipyard = new ShipyardDisplay(container, board);
