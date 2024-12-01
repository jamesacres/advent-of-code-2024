const similarityScore = (listOne: number[], listTwo: number[]) => {
  if (listOne.length !== listTwo.length) {
    throw Error("Lists must be same length");
  }
  const listTwoNumberCountMap = listTwo.reduce(
    (result: { [number: number]: number }, number) => {
      if (number in result) {
        result[number] = result[number] + 1;
      } else {
        result[number] = 1;
      }
      return result;
    },
    {},
  );

  return listOne.reduce((result, number) => {
    const similarityScore = number * (listTwoNumberCountMap[number] || 0);
    return result + similarityScore;
  }, 0);
};

export { similarityScore };
