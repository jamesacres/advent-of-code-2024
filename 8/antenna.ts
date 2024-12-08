interface State {
  frequency?: string;
  antinode: {
    [frequency: string]: boolean;
  };
}

interface Map<T> {
  [x: number]: {
    [y: number]: T;
  };
}

export enum Direction {
  N = "N",
  S = "S",
  E = "E",
  W = "W",
  NE = "NE",
  NW = "NW",
  SE = "SE",
  SW = "SW",
}

const getNextLocation = (
  { x, y }: { x: number; y: number },
  direction: Direction,
  max: { x: number; y: number },
  distance: number,
): { x: number; y: number } | undefined => {
  const next: {
    [direction in Direction]: { x: number; y: number };
  } = {
    [Direction.N]: { x, y: y - distance },
    [Direction.S]: { x, y: y + distance },
    [Direction.E]: { x: x + distance, y },
    [Direction.W]: { x: x - distance, y },
    [Direction.NE]: { x: x - distance, y: y - 1 },
    [Direction.NW]: { x: x + distance, y: y - 1 },
    [Direction.SE]: { x: x + distance, y: y + 1 },
    [Direction.SW]: { x: x - distance, y: y + 1 },
  };
  const result = next[direction];
  if (
    (result.x! > max.x || result.x! < 0) || (result.y! > max.y || result.y! < 0)
  ) {
    return undefined;
  }
  return result;
};

const getOppositeDirection = (direction: Direction) => {
  const opposite: {
    [direction in Direction]: Direction;
  } = {
    [Direction.N]: Direction.S,
    [Direction.S]: Direction.N,
    [Direction.E]: Direction.W,
    [Direction.W]: Direction.E,
    [Direction.NE]: Direction.SW,
    [Direction.NW]: Direction.SE,
    [Direction.SE]: Direction.NW,
    [Direction.SW]: Direction.NE,
  };
  return opposite[direction];
};

const setAntinodes = (map: Map<State>): void => {
  const maxx = Object.keys(map).length;
  const maxy = Object.keys(map[0]).length;
  [...new Array(maxy)].map((_, y) => {
    [...new Array(maxx)].map((_, x) => {
      if (map[x][y].frequency) {
        const frequency = map[x][y].frequency;
        // Check if there is another in line twice as far away
        Object.values(Direction).map((direction) => {
          const locationToCheck = getNextLocation({ x, y }, direction, {
            x: maxx,
            y: maxy,
          }, 2);
          const locationToSet = getNextLocation(
            { x, y },
            getOppositeDirection(direction),
            { x: maxx, y: maxy },
            -2,
          );
          return { locationToCheck, locationToSet };
        }).forEach(
          ({ locationToCheck, locationToSet }) => {
            if (locationToSet && locationToCheck) {
              const checkMap = map[locationToCheck.x][locationToCheck.y];
              const setMap = map[locationToSet.x][locationToSet.y];
              const isSameFrequency = frequency ===
                checkMap.frequency;
              if (
                isSameFrequency
              ) {
                setMap
                  .antinode[frequency] = true;
              }
              // map[x][y].antinode[map[x][y].frequency!] = true;
            }
          },
        );
      }
    });
  });
};

const getMap = (mapString: string): Map<State> => {
  const map: Map<State> = {};
  Object.entries(mapString.split("\n")).map(([y, line]) => {
    Object.entries(line.split("")).map(([x, state]) => {
      if (!map[Number(x)]) {
        map[Number(x)] = {};
      }
      const frequency = /[a-zA-Z0-9]/.test(state) ? state : undefined;
      const antinode = {};
      map[Number(x)][Number(y)] = { frequency, antinode };
    });
  });
  return map;
};

const mapToString = (map: Map<State>): string => {
  const maxx = Object.keys(map).length;
  const maxy = Object.keys(map[0]).length;
  let result = "";
  [...new Array(maxy)].map((_, y) => {
    result = result ? `${result}\n` : result;
    [...new Array(maxx)].map((_, x) => {
      result = `${result}${
        map[x][y].frequency ||
        (Object.values(map[x][y].antinode).some((value) => !!value) ? "#" : ".")
      }`;
    });
  });
  return result;
};

export { getMap, mapToString, setAntinodes };
