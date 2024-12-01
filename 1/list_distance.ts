const listDistance = (listOne: number[], listTwo: number[]) => {
  if (listOne.length !== listTwo.length) {
    throw Error("Lists must be same length");
  }
  const sortedListOne = listOne.sort();
  const sortedListTwo = listTwo.sort();

  const distances = sortedListOne.map((valueOne, index) => {
    const valueTwo = sortedListTwo[index];
    return Math.abs(valueOne - valueTwo);
  });

  return distances.reduce((total, distance) => total + distance, 0);
};

export { listDistance };
