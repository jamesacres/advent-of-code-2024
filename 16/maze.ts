export enum Direction {
  UP = "^",
  DOWN = "v",
  LEFT = "<",
  RIGHT = ">",
}

export enum State {
  EMPTY = ".",
  WALL = "#",
  START = "S",
  END = "E",
}

interface Node {
  state: State;
  visited?: true;
  direction?: Direction;
  distance?: number;
  path: [number, number, number][];
}

interface Map<T> {
  [x: number]: {
    [y: number]: T;
  };
}

const getMaze = (
  mapString: string,
): {
  map: Map<Node>;
  startPosition: [number, number];
  endPosition: [number, number];
} => {
  const map: Map<Node> = {};
  let startPosition: [number, number] = [0, 0];
  let endPosition: [number, number] = [0, 0];
  Object.entries(mapString.split("\n")).map(([y, line]) => {
    Object.entries(line.split("")).map(([x, state]) => {
      if (!map[Number(x)]) {
        map[Number(x)] = {};
      }
      map[Number(x)][Number(y)] = { state: state as State, path: [] };
      if (state === State.START) {
        startPosition = [Number(x), Number(y)];
        map[Number(x)][Number(y)].distance = 0;
        map[Number(x)][Number(y)].direction = Direction.RIGHT;
      }
      if (state === State.END) {
        endPosition = [Number(x), Number(y)];
      }
    });
  });
  return { map, startPosition, endPosition };
};

const mazeToString = (
  map: Map<Node>,
  path: [number, number, number][],
): string => {
  const maxx = Object.keys(map).length;
  const maxy = Object.keys(map[0]).length;
  let result = "";
  [...new Array(maxy)].map((_, y) => {
    result = result ? `${result}\n` : result;
    [...new Array(maxx)].map((_, x) => {
      const isInPath = path.find((value) => value[0] === x && value[1] === y);
      result = `${result}${isInPath ? map[x][y].direction : map[x][y].state}`;
    });
  });
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

const getUnvisitedNeighbours = (
  maze: Map<Node>,
  position: [number, number],
  currentDirection: Direction,
): [string, [number, number]][] => {
  const [x, y] = position;
  const maxx = Object.keys(maze).length;
  const maxy = Object.keys(maze[0]).length;
  const positions: { [key in Direction]: [number, number] } = {
    [Direction.UP]: [x, y - 1],
    [Direction.DOWN]: [x, y + 1],
    [Direction.LEFT]: [x - 1, y],
    [Direction.RIGHT]: [x + 1, y],
  };
  return Object.entries(positions).filter((
    [direction, [x, y]],
  ) => (
    direction !== oppositeDirection(currentDirection) &&
    x >= 0 &&
    x < maxx && y >= 0 && y < maxy && !maze[x][y].visited &&
    [State.EMPTY, State.END].includes(maze[x][y].state)
  ));
};

const solveMaze = (maze: Map<Node>, startPosition: [number, number]) => {
  // Dijkstra's
  // Based on https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
  const unvisitedPositions = [startPosition];
  while (
    // Sort descending
    unvisitedPositions.sort((a, b) =>
      maze[b[0]][b[1]].distance! - maze[a[0]][a[1]].distance!
    ).length
  ) {
    // Visit next smallest
    const position = unvisitedPositions.pop()!;

    if (maze[position[0]][position[1]].state === State.END) {
      // Found the end, don't check our neighbours
      continue;
    }

    maze[position[0]][position[1]].visited = true;
    const { direction, distance, path } = maze[position[0]][position[1]];

    const unvisitedNeighbours = getUnvisitedNeighbours(
      maze,
      position,
      direction!,
    );
    for (
      const [newDirection, [neighbourx, neighboury]] of unvisitedNeighbours
    ) {
      const disanceToNeighbour = distance! +
        (newDirection !== direction ? 1001 : 1);
      if (
        maze[neighbourx][neighboury].distance === undefined ||
        disanceToNeighbour <= maze[neighbourx][neighboury].distance
      ) {
        maze[neighbourx][neighboury].distance = disanceToNeighbour;
        maze[neighbourx][neighboury].direction = newDirection as Direction;
        maze[neighbourx][neighboury].path = [...path, [
          position[0],
          position[1],
          disanceToNeighbour,
        ]];
      }
      unvisitedPositions.push([neighbourx, neighboury]);
    }
  }
};

export { getMaze, mazeToString, solveMaze };
