import Ship from './Ship';
import ShipNames from './ShipNames';

export default function Board(size) {
  let ships = {};
  ships[ShipNames.Carrier] = Ship(5);
  ships[ShipNames.Battleship] = Ship(4);
  ships[ShipNames.Destroyer] = Ship(3);
  ships[ShipNames.Submarine] = Ship(3);
  ships[ShipNames.PatrolBoat] = Ship(2);
  let placedShips = [];
  let validateShipInfo = function (name, x, y, horizontal) {
    if (ships[name] === undefined)
      throw new Error('Error: name must be a valid ship name');
    if (x < 0) throw new RangeError('x must be greater than or equal to zero');
    if (y < 0) throw new RangeError('y must be greater than or equal to zero');
    if (horizontal && x + ships[name].getLength() - 1 >= size)
      throw new RangeError(
        `x ${
          x + ships[name].getLength() - 1
        } must be less than the size of the board (${size})`
      );
    if (!horizontal && y + ships[name].getLength() - 1 >= size)
      throw new RangeError(
        `y (${
          y + ships[name].getLength() - 1
        }) must be less than the size of the board (${size})`
      );
  };

  let isValidShipPlacement = function (name, x, y, horizontal) {
    if (ships[name] === undefined)
      throw new Error('Error: name must be a valid ship name');
    let left = x;
    let top = y;
    let right = horizontal ? left + ships[name].getLength() - 1 : left;
    let bottom = horizontal ? top : top + ships[name].getLength() - 1;
    if (left < 0 || right < 0 || right >= size || bottom >= size) return false;

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
    validateShipInfo(name, x, y, horizontal);
    if (!isValidShipPlacement(name, x, y, horizontal)) return false;
    ships[name].setOrigin(x, y);
    ships[name].setHorizontal(horizontal);
    if (!placedShips.includes(name)) placedShips.push(name);
    return true;
  };

  let removeShip = function (name) {
    if (ships[name] === undefined)
      throw new Error('Error: name must be a valid ship name');
    placedShips = placedShips.filter((v) => v !== name);
    ships[name].resetHits();
  };

  let hit = function (x, y) {
    for (const name in ships) {
      if (placedShips.includes(name) && ships[name].hit(x, y)) return name;
    }
    return false;
  };

  let isSunk = function (name) {
    if (ships[name] === undefined)
      throw new Error('Error: name must be a valid ship name');
    return ships[name].isSunk();
  };

  let getShipInfo = function (name) {
    if (ships[name] === undefined)
      throw new Error('Error: name must be a valid ship name');
    if (!placedShips.includes(name)) return undefined;
    return {
      origin: ships[name].getOrigin(),
      horizontal: ships[name].isHorizontal(),
      sunk: ships[name].isSunk(),
      length: ships[name].getLength(),
    };
  };

  let reset = function () {
    for (const name in ShipNames) {
      removeShip(name);
    }
  };

  return {
    placeShip,
    removeShip,
    hit,
    isSunk,
    getShipInfo,
    isValidShipPlacement,
    reset,
  };
}
