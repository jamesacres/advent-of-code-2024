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

interface State {
  position: { x: number; y: number };
  presses: { [button: string]: number };
  pressCount: number;
  found?: boolean;
  overshot?: boolean;
  gaveUp?: boolean;
}

const pressButton = (
  button: Machine["buttons"][0],
  oldState: State,
  machine: Machine,
) => {
  const newState: State = JSON.parse(JSON.stringify(oldState));
  newState.pressCount = newState.pressCount + 1;
  newState.presses[button.name] = newState.presses[button.name] + 1;
  newState.position.x = newState.position.x + button.x;
  newState.position.y = newState.position.y + button.y;
  if (
    newState.position.x === machine.prize.x &&
    newState.position.y === machine.prize.y
  ) {
    newState.found = true;
  } else if (
    newState.position.x > machine.prize.x ||
    newState.position.y > machine.prize.y
  ) {
    newState.overshot = true;
  } else if (newState.pressCount > 100) {
    newState.gaveUp = true;
  }
  return newState;
};

const pressButtons = (
  state: State,
  machine: Machine,
): State[] => {
  const result: State[] = [];
  machine.buttons.map((button) => {
    const newState = pressButton(button, state, machine);
    if (newState.found || newState.overshot || newState.gaveUp) {
      result.push(newState);
    } else {
      // Press buttons again
      result.push(...pressButtons(newState, machine));
    }
  });
  return result;
};

const buttonPresses = (machine: Machine) => {
  const state: State = {
    position: { x: 0, y: 0 },
    presses: machine.buttons.reduce((result: State["presses"], { name }) => {
      result[name] = 0;
      return result;
    }, {}),
    pressCount: 0,
  };
  return pressButtons(state, machine).filter(({ found }) => found);
};

export { buttonPresses, parseInput };
