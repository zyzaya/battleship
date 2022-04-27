export default class DisplayBoard {
  constructor(container) {
    let div = document.createElement('div');
    div.classList.add('board');
    for (let y = 0; y < 11; y++) {
      for (let x = 0; x < 11; x++) {
        let cell = document.createElement('div');
        if (y === 0 && x > 0) {
          cell.textContent = String.fromCharCode(64 + x);
          cell.classList.add('labelCell');
        } else if (x === 0 && y > 0) {
          cell.textContent = y.toString();
          cell.classList.add('labelCell');
        } else if (x > 0 && y > 0) cell.classList.add('cell');
        div.appendChild(cell);
      }
    }
    container.appendChild(div);
  }
}
