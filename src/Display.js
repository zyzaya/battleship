import DisplayBoard from './DisplayBoard';
import Shipyard from './Shipyard';

export default function Display(battleship, container) {
  let opponent = DisplayBoard(container);
  let player = DisplayBoard(container);
  player.onCellDrop = (e, x, y) => {
    e.preventDefault();
    let info = JSON.parse(e.dataTransfer.getData('text'));
    let origin = player.cellFromPoint(
      e.x - e.offsetX - info.offsetX + 25,
      e.y - e.offsetY - info.offsetY + 25
    );
    battleship.placeShip(info.name, origin.x, origin.y, true);
    player.drawShip(info.name, battleship.getShipInfo(info.name, true));
  };
  player.onCellClick = (e, x, y) => {};
  let shipyard = Shipyard(container);
  shipyard.onShipDragStart = (e, name) => {
    e.dataTransfer.setData(
      'text',
      JSON.stringify({
        name: e.target.id,
        offsetX: e.offsetX,
        offsetY: e.offsetY,
      })
    );
  };
  shipyard.onShipClick = (e, name) => {
    // let info = board.getShipInfo(name);
    // if (info === undefined) return;
    // console.log(info);
    // board.placeShip(name, info.origin.x, info.origin.y, !info.horizontal);
  };
  return {};
}
