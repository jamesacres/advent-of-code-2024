enum Operator {
  PLUS = "+",
  MULTIPLY = "*",
}

type CalculateResult = {
  [operator in Operator]: { result: number; next?: CalculateResult };
};
const calculate = (a: number, b: number): CalculateResult => {
  return {
    [Operator.PLUS]: { result: a + b },
    [Operator.MULTIPLY]: { result: a * b },
  };
};

const hasValidOperations = (
  { total, numbers }: { total: number; numbers: number[] },
): boolean => {
  let possibleOperations: CalculateResult;
  let lastPointers: CalculateResult[] = [];
  let foundValid = false;
  [...new Array(numbers.length - 1)].forEach((_, i) => {
    const left = i === 0 ? numbers[i] : lastPointers;
    const right = numbers[i + 1];
    const isLastNumber = numbers.length === i + 2;
    lastPointers = [];
    if (typeof left === "number") {
      possibleOperations = calculate(left, right);
      lastPointers.push(possibleOperations);
      if (
        isLastNumber &&
        Object.values(possibleOperations).some(({ result }) => result === total)
      ) {
        foundValid = true;
      }
    } else {
      for (const lastPointer of left) {
        Object.entries(lastPointer).forEach(([_operator, result]) => {
          result.next = calculate(result.result, right);
          lastPointers.push(result.next);
          if (
            isLastNumber &&
            Object.values(result.next).some(({ result }) => result === total)
          ) {
            foundValid = true;
          }
        });
      }
    }
  });
  return foundValid;
};

const findValidOperations = (
  equations: { total: number; numbers: number[] }[],
): { total: number; numbers: number[]; hasValidOperations: boolean }[] => {
  return equations.map((equation) => {
    return {
      ...equation,
      hasValidOperations: hasValidOperations(equation),
    };
  });
};

export { findValidOperations };
