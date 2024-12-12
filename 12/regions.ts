interface Map<T> {
  [x: number]: {
    [y: number]: T;
  };
}

interface State {
  plant: string;
  regionId: number;
}

export enum Direction {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}

interface Region {
  regionId: number;
  coordinates: [number, number][];
  area?: number;
  perimeter?: number;
  sides?: number;
}

const getNeighbours = (
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

const getDiagonals = (
  { x, y }: { x: number; y: number },
): {
  [direction in Direction]: { x: number; y: number };
} => {
  return {
    [Direction.UP]: { x: x + 1, y: y - 1 },
    [Direction.RIGHT]: { x: x + 1, y: y + 1 },
    [Direction.DOWN]: { x: x - 1, y: y + 1 },
    [Direction.LEFT]: { x: x - 1, y: y - 1 },
  };
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

const getNextLocation = (
  position: { x: number; y: number },
  direction: Direction,
  max: { x: number; y: number },
): { x: number; y: number } | undefined => {
  const result = getNeighbours(position)[direction];
  if (
    (result.x! > max.x || result.x! < 0) || (result.y! > max.y || result.y! < 0)
  ) {
    return undefined;
  }
  return result;
};

const changeRegion = (
  fromRegion: number,
  toRegion: number,
  map: Map<State>,
  regions: Region[],
) => {
  for (const [x, y] of regions[fromRegion].coordinates) {
    map[x][y].regionId = toRegion;
    regions[toRegion].coordinates.push([x, y]);
  }
  regions[fromRegion].coordinates = [];
};

const getGarden = (
  gardenString: string,
): { map: Map<State>; regions: Region[] } => {
  const regions: Region[] = [];
  const map: Map<State> = {};
  const rows = gardenString.split("\n");
  const max = { x: rows[0].length - 1, y: rows.length - 1 };
  Object.entries(rows).map(([y, line]) => {
    Object.entries(line.split("")).map(([x, plant]) => {
      if (!map[Number(x)]) {
        map[Number(x)] = {};
      }

      // Check to the left of us to see if we're in that region
      let regionId: number | undefined;
      const left = getNextLocation(
        { x: Number(x), y: Number(y) },
        Direction.LEFT,
        max,
      );
      if (left) {
        const leftState = map[left.x][left.y];
        if (leftState.plant === plant) {
          regionId = leftState.regionId;
        }
      }

      // Check above us to see if we're in that region
      const up = getNextLocation(
        { x: Number(x), y: Number(y) },
        Direction.UP,
        max,
      );
      if (up) {
        const upState = map[up.x][up.y];
        if (upState.plant === plant) {
          if (regionId && upState.regionId !== regionId) {
            // If we've already got a regionId we've made a mistake to the left
            // We need to merge that region with this region
            changeRegion(upState.regionId, regionId, map, regions);
          } else {
            regionId = upState.regionId;
          }
        }
      }

      if (regionId === undefined) {
        // New region
        regionId = regions.length;
        regions.push({
          regionId,
          coordinates: [[Number(x), Number(y)]],
        });
      } else {
        regions[regionId].coordinates.push(
          [Number(x), Number(y)],
        );
      }

      map[Number(x)][Number(y)] = {
        plant,
        regionId,
      };
    });
  });
  return { map, regions };
};

const mapToString = (map: Map<State>): string => {
  const maxx = Object.keys(map).length;
  const maxy = Object.keys(map[0]).length;
  let result = "";
  [...new Array(maxy)].map((_, y) => {
    result = result ? `${result}\n` : result;
    [...new Array(maxx)].map((_, x) => {
      result = `${result}[${map[x][y].regionId}]`;
    });
  });
  return result;
};

const calculatePerimeter = (
  coordinates: [number, number][],
  max: [number, number],
): number => {
  let touchCount = 0;
  coordinates.forEach(([x, y]) => {
    Object.values(getNeighbours({ x, y })).filter(({ x, y }) => {
      return !(x > max[0] || x! < 0) || (y! > max[1] || y! < 0);
    }).forEach((neighbour) => {
      touchCount = touchCount +
        coordinates.filter(([x, y]) => neighbour.x === x && neighbour.y === y)
          .length;
    });
  });
  return (coordinates.length * 4) - (2 * (touchCount / 2));
};

const calculateSides = (
  coordinates: [number, number][],
): number => {
  let cornerCount = 0;
  coordinates.forEach(([x, y]) => {
    const neighbours = getNeighbours({ x, y });
    const diagonals = getDiagonals({ x, y });
    Object.values(Direction).map((direction) => {
      const a = neighbours[direction];
      const b = neighbours[turnRight(direction)];
      const diagonal = diagonals[direction];
      // Inner corner if something to our right and below but nothing on diagonal
      if (
        coordinates.find(([x, y]) => x === a.x && y === a.y) &&
        coordinates.find(([x, y]) => x === b.x && y === b.y) &&
        !coordinates.find(([x, y]) => x === diagonal.x && y === diagonal.y)
      ) {
        cornerCount = cornerCount + 1;
      }
      // Outer corner if nothing to our right and below
      if (
        !coordinates.find(([x, y]) => x === a.x && y === a.y) &&
        !coordinates.find(([x, y]) => x === b.x && y === b.y)
      ) {
        cornerCount = cornerCount + 1;
      }
    });
  });
  return cornerCount;
};

const stringToRegions = (gardenString: string): Region[] => {
  const garden = getGarden(gardenString);
  const max: [number, number] = [
    Object.keys(garden.map[0]).length - 1,
    Object.keys(garden.map).length - 1,
  ];
  console.info(mapToString(garden.map));
  const result = garden.regions.filter((region) => region.coordinates.length)
    .map(
      (region) => {
        region.area = region.coordinates.length;
        region.perimeter = calculatePerimeter(region.coordinates, max);
        region.sides = calculateSides(region.coordinates);
        return region;
      },
    );
  return result;
};

export { stringToRegions };
