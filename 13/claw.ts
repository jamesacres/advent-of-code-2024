const prices = { A: 3, B: 1 };
const getPrice = (button: "A" | "B"): number => {
  return prices[button];
};

interface Machine {
  buttons: { name: string; x: number; y: number }[];
  prize: { x: number; y: number };
}

const parseInput = (
  input: string,
): Machine[] => {
  const result: Machine[] = [];
  const lines = input.split("\n").filter((line) => line);
  let machine: Machine;
  lines.forEach((line, i) => {
    const j = i % 3;
    if (j === 0) {
      machine = { buttons: [], prize: { x: 0, y: 0 } };
    }
    if (j === 2) {
      const [_, x, y] = /Prize: X=([0-9]+), Y=([0-9]+)/.exec(line) || [];
      machine.prize = { x: Number(x), y: Number(y) };
      result.push(machine);
    } else {
      const [_, name, x, y] =
        /Button ([A-Z]): X\+([0-9]+), Y\+([0-9]+)/.exec(line) || [];
      machine.buttons?.push({ name, x: Number(x), y: Number(y) });
    }
  });
  return result;
};

const buttonPresses = (machine: Machine) => {
  // System of equations
  // Cramer's Rule
  const a = (machine.prize.x * machine.buttons[1].y -
    machine.prize.y * machine.buttons[1].x) /
    (machine.buttons[0].x * machine.buttons[1].y -
      machine.buttons[0].y * machine.buttons[1].x);
  const b = (machine.buttons[0].x * machine.prize.y -
    machine.buttons[0].y * machine.prize.x) /
    (machine.buttons[0].x * machine.buttons[1].y -
      machine.buttons[0].y * machine.buttons[1].x);
  return (!(Number.isInteger(a) && Number.isInteger(b))) ? undefined : {
    a,
    b,
  };
};

export { buttonPresses, getPrice, parseInput };
