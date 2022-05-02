import Board from './Board';
import DisplayBoard from './DisplayBoard';
import ShipyardDisplay from './ShipyardDisplay';

let container = document.getElementById('container');
let opponent = new DisplayBoard(container);
let player = new DisplayBoard(container, Board(10));
let shipyard = new ShipyardDisplay(container);
