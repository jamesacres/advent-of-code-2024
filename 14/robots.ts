export interface Robot {
  position: [number, number];
  velocity: [number, number];
}

const parseInput = (
  input: string,
): Robot[] => {
  const result: Robot[] = [];
  const lines = input.split("\n").filter((line) => line);
  lines.forEach((line) => {
    const [_, px, py, vx, vy] =
      /p=([0-9]+),([0-9]+) v=(-?[0-9]+),(-?[0-9]+)/.exec(line) || [];
    result.push({
      position: [Number(px), Number(py)],
      velocity: [Number(vx), Number(vy)],
    });
  });
  return result;
};

const move = (
  oldRobots: Robot[],
  seconds: number,
  robotArea: [number, number],
): { robots: Robot[]; robotCounts: { [position: string]: number } } => {
  const robotCounts: { [position: string]: number } = {};
  const newRobots = oldRobots.map((robot) => {
    const [x, y] = robot.position;
    const [dx, dy] = robot.velocity.map((velocity) => velocity * seconds);
    // If robot moves area width/height they will be back where they started on x/y
    // So let's move the remainder only
    const negativex = dx < 0 ? -1 : 1;
    const negativey = dy < 0 ? -1 : 1;
    const position: [number, number] = [
      x + (Math.abs(dx) % robotArea[0]) * negativex,
      y + (Math.abs(dy) % robotArea[1]) * negativey,
    ];
    if (position[0] < 0) {
      position[0] = robotArea[0] + position[0];
    } else if (position[0] >= robotArea[0]) {
      position[0] = position[0] - robotArea[0];
    }
    if (position[1] < 0) {
      position[1] = robotArea[1] + position[1];
    } else if (position[1] >= robotArea[1]) {
      position[1] = position[1] - robotArea[1];
    }
    robotCounts[`${position[0]},${position[1]}`] =
      (robotCounts[`${position[0]},${position[1]}`] || 0) + 1;
    return {
      ...robot,
      position,
    };
  });
  return { robotCounts, robots: newRobots };
};

const quadrants = (
  robotCounts: { [position: string]: number },
  robotArea: [number, number],
) => {
  const quadrantWidth = Math.floor(robotArea[0] / 2);
  const quadrantHeight = Math.floor(robotArea[1] / 2);
  return Object.entries(robotCounts).reduce((result: {
    q1: number;
    q2: number;
    q3: number;
    q4: number;
  }, [position, count]) => {
    const [x, y] = position.split(",").map(Number);
    if (x < quadrantWidth && y < quadrantHeight) {
      result.q1 = result.q1 + count;
    } else if (x > robotArea[0] - quadrantWidth - 1 && y < quadrantHeight) {
      result.q2 = result.q2 + count;
    } else if (x < quadrantWidth && y > robotArea[1] - quadrantHeight) {
      result.q3 = result.q3 + count;
    } else if (
      x > robotArea[0] - quadrantWidth - 1 &&
      y > robotArea[1] - quadrantHeight - 1
    ) {
      result.q4 = result.q4 + count;
    }
    return result;
  }, {
    q1: 0,
    q2: 0,
    q3: 0,
    q4: 0,
  });
};

const render = (
  robotCounts: { [position: string]: number },
  robotArea: [number, number],
) => {
  let result = "";
  const positions = Object.keys(robotCounts);
  [...new Array(robotArea[1])].map((_, y) => {
    [...new Array(robotArea[0])].map((_, x) => {
      const char = positions.includes(`${x},${y}`) ? "." : " ";
      result = `${result}${char}`;
    });
    result = `${result}\n`;
  });
  return result;
};

export { move, parseInput, quadrants, render };
