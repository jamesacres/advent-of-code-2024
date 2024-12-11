export type StoneMap = { [key in string]: number };
const cache: StoneMap = {};

const addStone = (result: StoneMap, stone: string) => {
  if (result[stone] === undefined) {
    result[stone] = 0;
  }
  result[stone] = result[stone] + 1;
};

const stringToStoneCount = (input: string) =>
  input.split(" ").reduce(
    (result: StoneMap, stone) => {
      addStone(result, stone);
      return result;
    },
    {},
  );

const blinkStone = (stone: string, iteration: number): number => {
  if (iteration === 0) {
    return 1;
  }
  if (cache[`${stone}-${iteration}`]) {
    return cache[`${stone}-${iteration}`];
  }
  let result;
  if (stone === "0") {
    result = blinkStone("1", iteration - 1);
  } else if (stone.length % 2 === 0) {
    const a = Number(stone.slice(0, stone.length / 2));
    const b = Number(stone.slice(stone.length / 2, stone.length));
    result = blinkStone(`${a}`, iteration - 1) +
      blinkStone(`${b}`, iteration - 1);
  } else {
    const nextStone = Number(stone) * 2024;
    result = blinkStone(`${nextStone}`, iteration - 1);
  }
  cache[`${stone}-${iteration}`] = result;
  return result;
};

const blink = (stones: StoneMap, iteration: number): number => {
  return Object.entries(stones).reduce((result, [stone, count]) => {
    const thisResult = blinkStone(stone, iteration);
    [...new Array(count)].forEach(
      (_) => {
        result = result + thisResult;
      },
    );
    return result;
  }, 0);
};

export { blink, stringToStoneCount };
