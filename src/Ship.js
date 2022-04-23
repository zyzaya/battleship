export default function Ship(length) {
  let getLength = () => {
    return length;
  };

  return {
    getLength,
  };
}
