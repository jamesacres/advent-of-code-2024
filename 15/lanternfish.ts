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
  BOX_LEFT = "[",
  BOX_RIGHT = "]",
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

const getMapV2 = (
  v1Map: Map<State>,
): { map: Map<State>; initialRobotPosition: [number, number] } => {
  const map: Map<State> = {};
  let initialRobotPosition: [number, number] = [0, 0];

  const maxx = Object.keys(v1Map).length;
  const maxy = Object.keys(v1Map[0]).length;
  [...new Array(maxy)].map((_, y) => {
    [...new Array(maxx)].map((_, x) => {
      const newX = x * 2;
      if (!map[Number(newX)]) {
        map[Number(newX)] = {};
      }
      if (!map[Number(newX + 1)]) {
        map[Number(newX + 1)] = {};
      }
      if (v1Map[x][y] === State.ROBOT) {
        initialRobotPosition = [Number(newX), Number(y)];
        map[Number(newX)][Number(y)] = State.ROBOT;
        map[Number(newX + 1)][Number(y)] = State.EMPTY;
      } else if (v1Map[x][y] === State.EMPTY) {
        map[Number(newX)][Number(y)] = State.EMPTY;
        map[Number(newX + 1)][Number(y)] = State.EMPTY;
      } else if (v1Map[x][y] === State.BOX) {
        map[Number(newX)][Number(y)] = State.BOX_LEFT;
        map[Number(newX + 1)][Number(y)] = State.BOX_RIGHT;
      } else if (v1Map[x][y] === State.WALL) {
        map[Number(newX)][Number(y)] = State.WALL;
        map[Number(newX + 1)][Number(y)] = State.WALL;
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

const parseInput = (input: string, v2: boolean = false): {
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
    ...(v2 ? getMapV2(getMap(mapString).map) : getMap(mapString)),
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
    } else if (
      nextState === State.BOX_LEFT ||
      nextState === State.BOX_RIGHT
    ) {
      // Rather than swapping the box with an empty space we now need to move each entire box
      if (direction === Direction.LEFT || direction === Direction.RIGHT) {
        // Moving left and right shifts the boxes on this line only
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
          // Move boxes along into empty space
          if (direction === Direction.LEFT) {
            for (let i = 0; i < robotPosition[0] - emptySpace.x; i = i + 1) {
              map[emptySpace.x + i][emptySpace.y] = i % 2 === 0
                ? State.BOX_LEFT
                : State.BOX_RIGHT;
            }
          } else if (direction === Direction.RIGHT) {
            for (let i = 0; i < emptySpace.x - robotPosition[0]; i = i + 1) {
              map[emptySpace.x - i][emptySpace.y] = i % 2 === 0
                ? State.BOX_RIGHT
                : State.BOX_LEFT;
            }
          }
          // Move into old box space
          map[robotPosition[0]][robotPosition[1]] = State.EMPTY;
          robotPosition = [nextLocation.x, nextLocation.y];
          map[robotPosition[0]][robotPosition[1]] = State.ROBOT;
        }
      }

      if (direction === Direction.UP || direction === Direction.DOWN) {
        // For up and down we need to keep increasing the spaces to check
        // For example when moving up...
        //
        //     []
        //    []
        // [][]
        //    @
        // We would need to check the spaces with . are available
        // Then update each affected space with what was below it
        // We only care about what is in the way of the boxes we have to move
        //  []...
        //   ..[]
        //   .[]
        // [][]
        //    @
        const boxesToMove: [number, number][] = [];

        // Find next empty space in this direction
        let emptySpaces;

        let spacesToCheck: { x: number; y: number }[] = [];
        if (nextState === State.BOX_LEFT) {
          // Check entire box
          boxesToMove.push([nextLocation.x, nextLocation.y]);
          spacesToCheck = [
            getNextLocations({
              x: nextLocation.x,
              y: nextLocation.y,
            })[direction],
            getNextLocations({
              x: nextLocation.x + 1,
              y: nextLocation.y,
            })[direction],
          ];
        }
        if (nextState === State.BOX_RIGHT) {
          // Check entire box
          boxesToMove.push([nextLocation.x - 1, nextLocation.y]);
          spacesToCheck = [
            getNextLocations({
              x: nextLocation.x - 1,
              y: nextLocation.y,
            })[direction],
            getNextLocations({
              x: nextLocation.x,
              y: nextLocation.y,
            })[direction],
          ];
        }
        while (
          !emptySpaces &&
          spacesToCheck.every((spaceToCheck) =>
            map[spaceToCheck.x][spaceToCheck.y] !== State.WALL
          )
        ) {
          if (
            spacesToCheck.every((spaceToCheck) =>
              map[spaceToCheck.x][spaceToCheck.y] === State.EMPTY
            )
          ) {
            // Found an empty space!
            emptySpaces = spacesToCheck;
          } else {
            // Found box(es)
            const newBoxes: [number, number][] = [];
            let lastBoxX: number | undefined;
            spacesToCheck.forEach((spaceToCheck) => {
              if (map[spaceToCheck.x][spaceToCheck.y] === State.BOX_LEFT) {
                newBoxes.push([spaceToCheck.x, spaceToCheck.y]);
                lastBoxX = spaceToCheck.x;
              }
              if (
                map[spaceToCheck.x][spaceToCheck.y] === State.BOX_RIGHT &&
                lastBoxX !== spaceToCheck.x - 1
              ) {
                newBoxes.push([spaceToCheck.x - 1, spaceToCheck.y]);
                lastBoxX = spaceToCheck.x - 1;
              }
            });
            // Add new boxes to the total boxes to move list
            boxesToMove.push(...newBoxes);

            // Check next spaces blocking the new boxes
            spacesToCheck = [];
            for (const newBox of newBoxes) {
              spacesToCheck.push(
                getNextLocations({
                  x: newBox[0],
                  y: newBox[1],
                })[direction],
              );
              spacesToCheck.push(
                getNextLocations({
                  x: newBox[0] + 1,
                  y: newBox[1],
                })[direction],
              );
            }
          }
        }
        if (emptySpaces) {
          // Move all boxes up into empty spaces, starting with the ones at the top
          const directionDistance = direction === Direction.UP ? -1 : 1;
          for (const boxToMove of boxesToMove.reverse()) {
            map[boxToMove[0]][boxToMove[1] + directionDistance] =
              State.BOX_LEFT;
            map[boxToMove[0] + 1][boxToMove[1] + directionDistance] =
              State.BOX_RIGHT;
            map[boxToMove[0]][boxToMove[1]] = State.EMPTY;
            map[boxToMove[0] + 1][boxToMove[1]] = State.EMPTY;
          }

          // Move into old box space
          map[robotPosition[0]][robotPosition[1]] = State.EMPTY;
          robotPosition = [nextLocation.x, nextLocation.y];
          map[robotPosition[0]][robotPosition[1]] = State.ROBOT;
        }
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
      if (map[x][y] === State.BOX || map[x][y] === State.BOX_LEFT) {
        result = result + ((100 * y) + x);
      }
    });
  });
  return result;
};

export { mapSumGPS, mapToString, move, parseInput };
