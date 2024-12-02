const checkIsSafe = (numbers: number[]) => {
  let forwards = false;
  for (const [indexString, number] of Object.entries(numbers)) {
    const index = Number(indexString);
    const previousNumber = index ? numbers[index - 1] : undefined;
    if (
      index === 1 && previousNumber !== undefined && number > previousNumber
    ) {
      forwards = true;
    }
    if (
      index > 1
    ) {
      if (
        forwards && previousNumber !== undefined &&
        number < previousNumber
      ) {
        // was forwards, now backwards, unsafe
        return false;
      }
      if (
        !forwards && previousNumber !== undefined &&
        number > previousNumber
      ) {
        // was backwards, now forwards, unsafe
        return false;
      }
    }
    if (
      previousNumber && ![1, 2, 3].includes(Math.abs(previousNumber - number))
    ) {
      // greater than 1 or 2 distance
      return false;
    }
  }
  return true;
};

export { checkIsSafe };
