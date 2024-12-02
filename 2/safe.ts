const checkIsSafe = (
  numbers: number[],
): { safe: boolean; unsafeIndex?: number } => {
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
        return { safe: false, unsafeIndex: index };
      }
      if (
        !forwards && previousNumber !== undefined &&
        number > previousNumber
      ) {
        // was backwards, now forwards, unsafe
        return { safe: false, unsafeIndex: index };
      }
    }
    if (
      previousNumber && ![1, 2, 3].includes(Math.abs(previousNumber - number))
    ) {
      // greater than allowed distance
      return { safe: false, unsafeIndex: index };
    }
  }
  return { safe: true };
};

const checkIsSafeDampener = (numbers: number[]) => {
  const { safe, unsafeIndex } = checkIsSafe(numbers);
  if (safe) {
    return true;
  }

  if (unsafeIndex) {
    const newNumbers = [...numbers];
    newNumbers.splice(unsafeIndex!, 1);
    if (checkIsSafe(newNumbers).safe) {
      return true;
    }

    if (unsafeIndex > 0) {
      // Replace index before instead
      const newNumbers = [...numbers];
      newNumbers.splice(unsafeIndex - 1, 1);
      if (checkIsSafe(newNumbers).safe) {
        return true;
      }
    }

    // Try to replace first index
    const newNumbers2 = [...numbers];
    newNumbers2.splice(0, 1);
    if (checkIsSafe(newNumbers2).safe) {
      return true;
    }
  }

  return false;
};

export { checkIsSafe, checkIsSafeDampener };
