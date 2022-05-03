import ShipNames from './ShipNames';

export default class DisplayBoard {
  constructor(container, board) {
    let div = document.createElement('div');
    div.classList.add('board');
    let draw = function () {
      for (const name in ShipNames) {
        let info = board.getShipInfo(name);
        if (info != undefined) {
          let shipIcon = document.getElementById(name);
          let right = info.origin.x + 3;
          let bottom = info.origin.y + 3;
          if (info.horizontal) {
            right += info.length - 1;
            shipIcon.classList.remove('verticalShip');
            shipIcon.classList.add('horizontalShip');
          } else {
            bottom += info.length - 1;
            shipIcon.classList.remove('horizontalShip');
            shipIcon.classList.add('verticalShip');
          }

          shipIcon.style.gridArea = `
            ${info.origin.y + 2} / 
            ${info.origin.x + 2} / 
            ${bottom} / 
            ${right}`;
          div.appendChild(shipIcon);
        }
      }
    };

    for (let y = 0; y < 11; y++) {
      for (let x = 0; x < 11; x++) {
        let cell = document.createElement('div');
        cell.id = JSON.stringify({ x: x - 1, y: y - 1 });
        cell.style.gridArea = `${y + 1} / ${x + 1} / ${y + 2} / ${x + 2}`;
        if (y === 0 && x > 0) {
          cell.textContent = String.fromCharCode(64 + x);
          cell.classList.add('labelCell');
        } else if (x === 0 && y > 0) {
          cell.textContent = y.toString();
          cell.classList.add('labelCell');
        } else if (x > 0 && y > 0) cell.classList.add('cell');

        cell.ondragover = (e) => e.preventDefault();
        cell.ondrop = (e) => {
          e.preventDefault();
          let info = JSON.parse(e.dataTransfer.getData('text'));
          let origin = document.elementFromPoint(
            e.x - e.offsetX - info.offsetX + 25,
            e.y - e.offsetY - info.offsetY + 25
          );
          if (origin.classList.contains('cell') && div.contains(origin)) {
            let originCoords = JSON.parse(origin.id);
            board.removeShip(info.id);
            board.placeShip(info.id, originCoords.x, originCoords.y, false);
            draw();
          }
        };
        div.appendChild(cell);
      }
    }
    container.appendChild(div);
  }
}
