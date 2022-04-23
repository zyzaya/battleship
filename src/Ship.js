export default function Ship(length) {
  if (length < 0) {
    throw new RangeError('Ship length cannot be less than zero');
  }

  let getLength = () => {
    return length;
  };

  return {
    getLength,
  };
}
