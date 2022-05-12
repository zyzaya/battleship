import DisplayBoard from './DisplayBoard';
import ShipNames from './ShipNames';
import Shipyard from './Shipyard';

export default function Display(battleship, player, opponent, container) {
  let opponentDisplay = DisplayBoard(container);
  let playerDisplay = DisplayBoard(container);

  let isAllShipsPlaced = function () {
    return Object.keys(ShipNames).every(
      (name) => battleship.getShipInfo(name, true) !== undefined
    );
  };
  playerDisplay.onCellDrop = (e) => {
    e.preventDefault();
    let info = JSON.parse(e.dataTransfer.getData('text'));
    let origin = playerDisplay.cellFromPoint(
      e.x - e.offsetX - info.offsetX + 25,
      e.y - e.offsetY - info.offsetY + 25
    );
    if (origin !== undefined)
      battleship.placeShip(
        info.name,
        origin.x,
        origin.y,
        info.horizontal,
        true
      );
    playerDisplay.drawShip(info.name, battleship.getShipInfo(info.name, true));
    if (isAllShipsPlaced()) start.disabled = false;
  };
  opponentDisplay.onCellClick = (e) => {
    let origin = opponentDisplay.cellFromPoint(
      e.x - e.offsetX,
      e.y - e.offsetY
    );
    player.setGuess(origin.x, origin.y);
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
    playerDisplay.drawShip(name, battleship.getShipInfo(name, true));
  };

  let startDiv = document.createElement('div');
  let start = document.createElement('button');
  start.classList.add('start');
  start.disabled = true;
  start.textContent = 'Start Game';
  start.onclick = () => {
    for (const name in ShipNames) {
      let pos = opponent.getShipPosition(name);
      console.log(`${name}: ${JSON.stringify(pos)}`);
      battleship.placeShip(name, pos.x, pos.y, pos.horizontal, false);
      // opponentDisplay.drawShip(name, battleship.getShipInfo(name, false));
    }
    battleship.start();
  };
  startDiv.appendChild(start);
  container.appendChild(startDiv);

  let drawShips = function () {
    for (const name in ShipNames) {
      playerDisplay.drawShip(name, battleship.getShipInfo(name, true));
    }
  };

  let drawGuesses = function () {
    player.getHistory().forEach((e) => {
      opponentDisplay.drawGuess(e.x, e.y, e.isHit);
    });

    opponent.getHistory().forEach((e) => {
      playerDisplay.drawGuess(e.x, e.y, e.isHit);
    });
  };

  let draw = function () {
    drawShips();
    drawGuesses();
    // for each placed ship draw ship on player board
    // for each player guess draw x or o on opponent board
    // for each opponent guess draw x or o on player board
  };
  return { draw };
}
