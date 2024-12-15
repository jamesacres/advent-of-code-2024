export enum Direction {
  UP = "^",
  DOWN = "v",
  LEFT = "<",
  RIGHT = ">",
}

export enum State {
  EMPTY = ".",
  WALL = "#",
  BOX = "O",
  ROBOT = "@",
}

interface Map<T> {
  [x: number]: {
    [y: number]: T;
  };
}

const getMap = (
  mapString: string,
): { map: Map<State>; initialRobotPosition: [number, number] } => {
  const map: Map<State> = {};
  let initialRobotPosition: [number, number] = [0, 0];
  Object.entries(mapString.split("\n")).map(([y, line]) => {
    Object.entries(line.split("")).map(([x, state]) => {
      if (!map[Number(x)]) {
        map[Number(x)] = {};
      }
      map[Number(x)][Number(y)] = state as State;
      if (state === State.ROBOT) {
        initialRobotPosition = [Number(x), Number(y)];
      }
    });
  });
  return { map, initialRobotPosition };
};

const mapToString = (map: Map<State>): string => {
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

const getNextLocations = (
  { x, y }: { x: number; y: number },
): {
  [direction in Direction]: { x: number; y: number };
} => {
  return {
    [Direction.UP]: { x, y: y - 1 },
    [Direction.DOWN]: { x, y: y + 1 },
    [Direction.LEFT]: { x: x - 1, y },
    [Direction.RIGHT]: { x: x + 1, y },
  };
};

const parseInput = (input: string): {
  map: Map<State>;
  initialRobotPosition: [number, number];
  directions: Direction[];
} => {
  let mapString = "";
  const directions: Direction[] = [];
  const lines = input.split("\n").filter((line) => line);
  lines.forEach((line) => {
    if (line.startsWith("#")) {
      const newLine = mapString ? "\n" : "";
      mapString = `${mapString}${newLine}${line}`;
    } else if (line) {
      directions.push(...line.split("") as Direction[]);
    }
  });
  return {
    directions,
    ...getMap(mapString),
  };
};

const move = (
  map: Map<State>,
  initialRobotPosition: [number, number],
  directions: Direction[],
): Map<State> => {
  let robotPosition: [number, number] = initialRobotPosition;
  directions.forEach((direction) => {
    const nextRobotLocations = getNextLocations({
      x: robotPosition[0],
      y: robotPosition[1],
    });
    const nextLocation = nextRobotLocations[direction];
    const nextState = map[nextLocation.x][nextLocation.y];
    if (nextState === State.EMPTY) {
      // Move into empty space
      map[robotPosition[0]][robotPosition[1]] = State.EMPTY;
      robotPosition = [nextLocation.x, nextLocation.y];
      map[robotPosition[0]][robotPosition[1]] = State.ROBOT;
    } else if (nextState === State.BOX) {
      // Find next empty space in this direction
      let emptySpace;
      let spaceToCheck = getNextLocations({
        x: nextLocation.x,
        y: nextLocation.y,
      })[direction];
      while (
        !emptySpace && map[spaceToCheck.x][spaceToCheck.y] !== State.WALL
      ) {
        if (map[spaceToCheck.x][spaceToCheck.y] === State.EMPTY) {
          // Found an empty space!
          emptySpace = spaceToCheck;
        } else {
          // Check next space
          spaceToCheck = getNextLocations({
            x: spaceToCheck.x,
            y: spaceToCheck.y,
          })[direction];
        }
      }
      if (emptySpace) {
        // Move box into empty space
        map[emptySpace.x][emptySpace.y] = State.BOX;
        // Move into old box space
        map[robotPosition[0]][robotPosition[1]] = State.EMPTY;
        robotPosition = [nextLocation.x, nextLocation.y];
        map[robotPosition[0]][robotPosition[1]] = State.ROBOT;
      }
    }
  });
  return map;
};

const mapSumGPS = (
  map: Map<State>,
): number => {
  const maxx = Object.keys(map).length;
  const maxy = Object.keys(map[0]).length;
  let result = 0;
  [...new Array(maxy)].map((_, y) => {
    [...new Array(maxx)].map((_, x) => {
      if (map[x][y] === State.BOX) {
        result = result + ((100 * y) + x);
      }
    });
  });
  return result;
};

export { mapSumGPS, mapToString, move, parseInput };
