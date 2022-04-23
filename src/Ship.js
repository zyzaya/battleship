export default function Ship(length) {
  if (length < 0) {
    throw new RangeError('Ship length cannot be less than zero');
  }
  let x = 0;
  let y = 0;
  let horizontal = true;

  let getLength = () => {
    return length;
  };

  let setOrigin = (newX, newY) => {
    x = newX;
    y = newY;
  };

  let getOrigin = () => {
    return {
      x,
      y,
    };
  };

  let isHorizontal = () => {
    return horizontal;
  };

  let setHorizontal = (value) => {
    horizontal = value;
  };

  return {
    getLength,
    getOrigin,
    setOrigin,
    isHorizontal,
    setHorizontal,
  };
}
