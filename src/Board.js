import Ship from './Ship';

export default function Board(size) {
  // place ship(shipname, x, y)
  // remove ship
  // isHit(x, y)
  /* 
    carrier: 5
    battleship: 4
    destroyer: 3
    submarine: 3
    patrol boat: 2
  */
  let ships = {
    Carrier: Ship(5),
    Battleship: Ship(4),
    Destroyer: Ship(3),
    Submarine: Ship(2),
    PatrolBoat: Ship(2),
  };
  let placedShips = [];

  let isValidShipPlacement = function (name, x, y, horizontal) {
    if (ships[name] === undefined)
      throw new Error('Error: name must be a valid ship name');
    // for every ship that isn't name and is placed
    // check if the new placement will overlap

    let left = x;
    let top = y;
    let right = horizontal ? left + ships[name].getLength() - 1 : left;
    let bottom = horizontal ? top : top + ships[name].getLength() - 1;
    return !placedShips.some((val) => {
      if (val !== name) {
        let l = ships[val].getOrigin().x;
        let t = ships[val].getOrigin().y;
        let r = ships[val].isHorizontal() ? l + ships[val].getLength() - 1 : l;
        let b = ships[val].isHorizontal() ? t : t + ships[val].getLength() - 1;
        // ships collide
        if (
          ((left >= l && left <= r) || (right >= l && right <= r)) &&
          ((top >= t && top <= b) || (bottom >= t && bottom <= b))
        ) {
          return true;
        }
      }
    });
  };

  let placeShip = function (name, x, y, horizontal) {
    if (ships[name] === undefined)
      throw new Error('Error: name must be a valid ship name');
    if (x < 0) throw new RangeError('x must be greater than or equal to zero');
    if (y < 0) throw new RangeError('y must be greater than or equal to zero');
    if (ships[name].isHorizontal() && x + ships[name].getLength() >= size)
      throw new RangeError(
        `x must be less than the size of the board (${size})`
      );
    if (!ships[name].isHorizontal() && y + ships[name].getLength() >= size)
      throw new RangeError(
        `y must be less than the size of the board (${size})`
      );
    if (!isValidShipPlacement(name, x, y, horizontal)) return false;
    ships[name].setOrigin(x, y);
    ships[name].setHorizontal(horizontal);
    if (!placedShips.includes(name)) placedShips.push(name);
    return true;
  };

  let isHit = function (x, y) {
    for (const name in ships) {
      if (placedShips.includes(name) && ships[name].hit(x, y)) return name;
    }
    return false;
  };

  return {
    Carrier: 'Carrier',
    Battleship: 'Battleship',
    Destroyer: 'Destroyer',
    Submarine: 'Submarine',
    PatrolBoat: 'PatrolBoat',
    placeShip,
    isHit,
  };
}
