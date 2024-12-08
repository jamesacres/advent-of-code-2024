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

const findAllAntinodes = (
  origin: { x: number; y: number; frequency: string },
  map: Map<State>,
  extended: boolean,
) => {
  const maxx = Object.keys(map).length;
  const maxy = Object.keys(map[0]).length;
  [...new Array(maxy)].map((_, y) => {
    [...new Array(maxx)].map((_, x) => {
      const comparison = map[x][y];
      if (
        x !== origin.x && y !== origin.y &&
        comparison.frequency === origin.frequency
      ) {
        let outOfBounds = false;
        let n = 1;
        while (!outOfBounds) {
          let oppositeOutOfBounds = false;
          let sameOutOfBounds = false;
          // Taxicab distance
          const distance = {
            x: (x - origin.x) * n,
            y: (y - origin.y) * n,
          };
          if (extended) {
            // Set an antinode on the origin
            map[origin.x][origin.y].antinode[origin.frequency] = true;
          }
          // Set an antinode distance in the opposite direction from origin
          if (
            (origin.x - distance.x) >= 0 && (origin.y - distance.y >= 0) &&
            (origin.x - distance.x) < maxx && (origin.y - distance.y < maxy)
          ) {
            const destination =
              map[origin.x - distance.x][origin.y - distance.y];
            if (extended) {
              destination.antinode[origin.frequency] = true;
            } else {
              destination.antinode = {
                [origin.frequency]: true,
              };
            }
          } else {
            oppositeOutOfBounds = true;
          }
          // Set an antinode distance in the same direction from here
          if (
            (x + distance.x) >= 0 && (y + distance.y >= 0) &&
            (x + distance.x) < maxx && (y + distance.y < maxy)
          ) {
            const destination = map[x + distance.x][y + distance.y];
            if (extended) {
              destination.antinode[origin.frequency] = true;
            } else {
              destination.antinode = {
                [origin.frequency]: true,
              };
            }
          } else {
            sameOutOfBounds = true;
          }

          if (extended) {
            outOfBounds = oppositeOutOfBounds && sameOutOfBounds;
            n = n + 1;
          } else {
            outOfBounds = true;
          }
        }
      }
    });
  });
};

const setAntinodes = (map: Map<State>, extended: boolean = false): void => {
  const maxx = Object.keys(map).length;
  const maxy = Object.keys(map[0]).length;
  [...new Array(maxy)].map((_, y) => {
    [...new Array(maxx)].map((_, x) => {
      if (map[x][y].frequency) {
        const frequency = map[x][y].frequency;
        findAllAntinodes({ x, y, frequency }, map, extended);
      }
    });
  });
};

const countAntinodes = (map: Map<State>): number => {
  let count = 0;
  const maxx = Object.keys(map).length;
  const maxy = Object.keys(map[0]).length;
  [...new Array(maxy)].map((_, y) => {
    [...new Array(maxx)].map((_, x) => {
      if (Object.values(map[x][y].antinode).length) {
        count = count + 1;
      }
    });
  });
  return count;
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

export { countAntinodes, getMap, mapToString, setAntinodes };
