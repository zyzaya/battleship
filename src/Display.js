import DisplayBoard from './DisplayBoard';
import Shipyard from './Shipyard';

export default function Display(battleship, container) {
  let opponent = new DisplayBoard(container);
  let player = new DisplayBoard(container);
  let shipyard = Shipyard(container);
  shipyard.onShipDragStart = (e, name) => {
    e.dataTransfer.setData(
      'text',
      JSON.stringify({
        id: e.target.id,
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
