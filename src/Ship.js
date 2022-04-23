export default function Ship(length) {
  if (length < 0) {
    throw new RangeError('Ship length cannot be less than zero');
  }
  let x = 0;
  let y = 0;

  let getLength = () => {
    return length;
  };

  let getOrigin = () => {
    return {
      x,
      y,
    };
  };

  return {
    getLength,
    getOrigin,
  };
}
