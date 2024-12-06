export enum Direction {
  UP = "^",
  DOWN = "v",
  LEFT = "<",
  RIGHT = ">",
}

export enum State {
  EMPTY = ".",
  OBSTACLE = "#",
  GUARD_UP = Direction.UP,
  GUARD_DOWN = Direction.DOWN,
  GUARD_LEFT = Direction.LEFT,
  GUARD_RIGHT = Direction.RIGHT,
}

interface Map<T> {
  [x: number]: {
    [y: number]: T;
  };
}

const getMap = (mapString: string): Map<State> => {
  const map: Map<State> = {};
  Object.entries(mapString.split("\n")).map(([y, line]) => {
    Object.entries(line.split("")).map(([x, state]) => {
      if (!map[Number(x)]) {
        map[Number(x)] = {};
      }
      map[Number(x)][Number(y)] = state as State;
    });
  });
  return map;
};

const getNextLocation = (
  { x, y }: { x: number; y: number },
  direction: Direction,
  max: { x: number; y: number },
): { x: number; y: number } | undefined => {
  const next: {
    [direction in Direction]: { x: number; y: number };
  } = {
    [Direction.UP]: { x, y: y - 1 },
    [Direction.DOWN]: { x, y: y + 1 },
    [Direction.LEFT]: { x: x - 1, y },
    [Direction.RIGHT]: { x: x + 1, y },
  };
  const result = next[direction];
  if (
    (result.x! > max.x || result.x! < 0) || (result.y! > max.y || result.y! < 0)
  ) {
    return undefined;
  }
  return result;
};

const turnRight = (direction: Direction) => {
  const nextDirection: { [direction in Direction]: Direction } = {
    [Direction.UP]: Direction.RIGHT,
    [Direction.DOWN]: Direction.LEFT,
    [Direction.LEFT]: Direction.UP,
    [Direction.RIGHT]: Direction.DOWN,
  };
  return nextDirection[direction];
};

const getVisitedMap = (map: Map<State>): Map<number> => {
  let guardPosition: { x: number; y: number } | undefined;
  let guardDirection: Direction | undefined;
  let max: { x: number; y: number } | undefined;

  // Initialise visited map
  const visitedMap: Map<number> = {};
  Object.entries(map).map(([xstring, line]) => {
    Object.entries(line).map(([ystring, value]) => {
      const x = Number(xstring);
      const y = Number(ystring);
      max = { x, y };
      if (!visitedMap[x]) {
        visitedMap[Number(x)] = {};
      }
      visitedMap[Number(x)][Number(y)] = visitedMap[Number(x)][Number(y)] ||
        0;
      // If guard is in position set visited to true and update guard position
      if (
        [State.GUARD_UP, State.GUARD_DOWN, State.GUARD_LEFT, State.GUARD_RIGHT]
          .includes(value as State)
      ) {
        visitedMap[Number(x)][Number(y)] = visitedMap[Number(x)][Number(y)] + 1;
        guardPosition = { x, y };
        guardDirection = value as Direction;
      }
    });
  });
  // Iterate guard position until she leaves the grid
  let retracingStepsCount = 0;
  while (guardPosition && guardDirection && max) {
    if (retracingStepsCount === 10) {
      throw Error("loop detected");
    }
    // Calculate next location
    const nextLocation = getNextLocation(guardPosition, guardDirection, max);
    // Move out of old position
    map[guardPosition.x][guardPosition.y] = State.EMPTY;
    // Move into new position
    if (nextLocation) {
      if (map[nextLocation.x][nextLocation.y] === State.EMPTY) {
        // Move into empty space
        guardPosition = nextLocation;
        visitedMap[guardPosition.x][guardPosition.y] =
          visitedMap[guardPosition.x][guardPosition.y] + 1;

        if (
          visitedMap[guardPosition.x][guardPosition.y] > retracingStepsCount
        ) {
          // Keep track of the max times we have retraced our steps
          retracingStepsCount = visitedMap[guardPosition.x][guardPosition.y];
        }
      } else if (map[nextLocation.x][nextLocation.y] === State.OBSTACLE) {
        // Turn right 90 degrees
        guardDirection = turnRight(guardDirection);
      } else {
        throw Error("unexpected state");
      }
    } else {
      guardPosition = nextLocation;
    }
  }
  return visitedMap;
};

const mapToString = (map: Map<State | number>): string => {
  const maxx = Object.keys(map).length;
  const maxy = Object.keys(map[0]).length;
  let result = "";
  [...new Array(maxy)].map((_, y) => {
    result = result ? `${result}\n` : result;
    [...new Array(maxx)].map((_, x) => {
      result = `${result}${map[x][y]}`;
    });
  });
  return result;
};

const getVisitedCount = (visitedMap: Map<number>) => {
  const maxx = Object.keys(visitedMap).length;
  const maxy = Object.keys(visitedMap[0]).length;
  let result = 0;
  [...new Array(maxy)].map((_, y) => {
    [...new Array(maxx)].map((_, x) => {
      result = visitedMap[x][y] ? result + 1 : result;
    });
  });
  return result;
};

export { getMap, getVisitedCount, getVisitedMap, mapToString };
