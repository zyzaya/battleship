import ShipNames from './ShipNames';

export default function Shipyard(container) {
  let shipyard = {};
  let div = document.createElement('div');
  div.classList.add('shipyard');
  shipyard.onShipClick = {};
  shipyard.onShipDragStart = {};

  for (const name in ShipNames) {
    let ship = document.createElement('div');
    ship.classList.add(name);
    ship.id = name;
    ship.classList.add('ship');
    ship.classList.add('verticalShip');
    ship.style.gridArea = name;
    ship.draggable = true;
    ship.ondragstart = (e) => {
      if (shipyard.onShipDragStart instanceof Function)
        shipyard.onShipDragStart(e, name);
    };
    ship.onclick = (e) => {
      if (shipyard.onShipClick instanceof Function)
        shipyard.onShipClick(e, name);
    };
    ship.textContent = name;
    div.appendChild(ship);
  }
  container.appendChild(div);
  return shipyard;
}
