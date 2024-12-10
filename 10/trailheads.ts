export enum Direction {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}

interface State {
  height: number;
  isTrailHead: boolean;
  trailCount?: number;
  destinations: { x: number; y: number }[];
}

interface Map<T> {
  [x: number]: {
    [y: number]: T;
  };
}

const getMap = (mapString: string): Map<State> => {
  const map: Map<State> = {};
  Object.entries(mapString.split("\n")).map(([y, line]) => {
    Object.entries(line.split("")).map(([x, height]) => {
      if (!map[Number(x)]) {
        map[Number(x)] = {};
      }
      map[Number(x)][Number(y)] = {
        height: Number(height),
        isTrailHead: height === "0",
        destinations: [],
      };
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

const oppositeDirection = (direction: Direction) => {
  const opposites = {
    [Direction.UP]: Direction.DOWN,
    [Direction.DOWN]: Direction.UP,
    [Direction.LEFT]: Direction.RIGHT,
    [Direction.RIGHT]: Direction.LEFT,
  };
  return opposites[direction];
};

const countRoutes = (
  map: Map<State>,
  { x, y }: { x: number; y: number },
  height: number,
  originState: State,
  thisDirection?: Direction,
  v2: boolean = false,
) => {
  const maxx = Object.keys(map).length - 1;
  const maxy = Object.keys(map[0]).length - 1;

  let count = 0;
  Object.values(Direction).filter((direction) =>
    !thisDirection || direction !== oppositeDirection(thisDirection)
  )
    .map((direction) => {
      const nextLocation = getNextLocation({ x, y }, direction, {
        x: maxx,
        y: maxy,
      });
      if (nextLocation) {
        const nextLocationState = map[nextLocation.x][nextLocation.y];
        if (nextLocationState.height === height + 1) {
          if (nextLocationState.height === 9) {
            // 9 is the final destination
            if (
              !originState.destinations.some(({ x, y }) =>
                x === nextLocation.x && y === nextLocation.y
              )
            ) {
              // Unseen destination
              originState.destinations.push({
                x: nextLocation.x,
                y: nextLocation.y,
              });
              if (!v2) {
                // Count only unseen
                count = count + 1;
              }
            }
            if (v2) {
              // Count all
              count = count + 1;
            }
          } else {
            // Move to next location
            count = count + countRoutes(
              map,
              { x: nextLocation.x, y: nextLocation.y },
              nextLocationState.height,
              originState,
              direction,
              v2,
            );
          }
        }
      }
    });

  return count;
};

const findTrailheadRoutes = (input: string, v2: boolean = false) => {
  const map = getMap(input);
  const maxx = Object.keys(map).length;
  const maxy = Object.keys(map[0]).length;
  [...new Array(maxy)].map((_, y) => {
    [...new Array(maxx)].map((_, x) => {
      const state = map[x][y];
      if (state.isTrailHead) {
        state.trailCount = countRoutes(
          map,
          { x, y },
          state.height,
          state,
          undefined,
          v2,
        );
      }
    });
  });

  return map;
};

const toTrailHeadsArray = (map: Map<State>) => {
  const trailHeads: State[] = [];
  const maxx = Object.keys(map).length;
  const maxy = Object.keys(map[0]).length;
  [...new Array(maxy)].map((_, y) => {
    [...new Array(maxx)].map((_, x) => {
      const state = map[x][y];
      if (state.isTrailHead) {
        trailHeads.push(state);
      }
    });
  });
  return trailHeads;
};

export { findTrailheadRoutes, toTrailHeadsArray };
