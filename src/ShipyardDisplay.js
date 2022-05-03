import ShipNames from './ShipNames';

export default class ShipyardDisplay {
  constructor(container, board) {
    let div = document.createElement('div');
    div.classList.add('shipyard');
    for (const name in ShipNames) {
      let ship = document.createElement('div');
      ship.classList.add(name);
      ship.id = name;
      ship.classList.add('ship');
      ship.classList.add('verticalShip');
      ship.style.gridArea = name;
      ship.draggable = true;
      ship.ondragstart = (e) => {
        e.dataTransfer.setData(
          'text',
          JSON.stringify({
            id: e.target.id,
            offsetX: e.offsetX,
            offsetY: e.offsetY,
          })
        );
      };
      ship.onclick = (e) => {
        let info = board.getShipInfo(name);
        if (info === undefined) return;
        console.log(info);
        board.placeShip(name, info.origin.x, info.origin.y, !info.horizontal);
      };
      ship.textContent = name;
      div.appendChild(ship);
    }
    container.appendChild(div);
  }
}
