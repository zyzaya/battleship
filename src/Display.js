import DisplayBoard from './DisplayBoard';
import ShipNames from './ShipNames';
import Shipyard from './Shipyard';

export default function Display(battleship, container) {
  let opponent = DisplayBoard(container);
  let player = DisplayBoard(container);

  let isAllShipsPlaced = function () {
    return Object.keys(ShipNames).every(
      (name) => battleship.getShipInfo(name, true) !== undefined
    );
  };
  player.onCellDrop = (e) => {
    e.preventDefault();
    let info = JSON.parse(e.dataTransfer.getData('text'));
    let origin = player.cellFromPoint(
      e.x - e.offsetX - info.offsetX + 25,
      e.y - e.offsetY - info.offsetY + 25
    );
    battleship.placeShip(info.name, origin.x, origin.y, info.horizontal, true);
    player.drawShip(info.name, battleship.getShipInfo(info.name, true));
    if (isAllShipsPlaced()) start.disabled = false;
  };
  opponent.onCellClick = (e) => {
    let origin = opponent.cellFromPoint(e.x - e.offsetX, e.y - e.offsetY);
    console.log(origin);
    // get to battleship somehow?
  };

  let shipyard = Shipyard(container);
  shipyard.onShipDragStart = (e, name) => {
    let info = battleship.getShipInfo(name, true);
    let horizontal = info === undefined ? false : info.horizontal;
    e.dataTransfer.setData(
      'text',
      JSON.stringify({
        name: e.target.id,
        offsetX: e.offsetX,
        offsetY: e.offsetY,
        horizontal: horizontal,
      })
    );
  };
  shipyard.onShipClick = (e, name) => {
    let info = battleship.getShipInfo(name, true);
    if (info === undefined) return;
    battleship.placeShip(
      name,
      info.origin.x,
      info.origin.y,
      !info.horizontal,
      true
    );
    player.drawShip(name, battleship.getShipInfo(name, true));
  };

  let startDiv = document.createElement('div');
  let start = document.createElement('button');
  start.classList.add('start');
  start.disabled = true;
  start.textContent = 'Start Game';
  start.onclick = () => {
    // set opponent stuff
    battleship.start();
  };
  startDiv.appendChild(start);
  container.appendChild(startDiv);
  return {};
}
