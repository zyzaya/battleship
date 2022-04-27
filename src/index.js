import DisplayBoard from './DisplayBoard';
import ShipyardDisplay from './ShipyardDisplay';

let container = document.getElementById('container');
let opponent = new DisplayBoard(container);
let player = new DisplayBoard(container);
let shipyard = new ShipyardDisplay(container);
