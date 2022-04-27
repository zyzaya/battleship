import ShipNames from './ShipNames';

export default class ShipyardDisplay {
  constructor(container) {
    let div = document.createElement('div');
    div.classList.add('shipyard');
    for (const name in ShipNames) {
      let ship = document.createElement('div');
      ship.classList.add(name);
      ship.classList.add('ship');
      ship.style.gridArea = name;
      ship.textContent = name;
      div.appendChild(ship);
    }
    container.appendChild(div);
  }
}
