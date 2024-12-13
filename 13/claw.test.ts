import { assertEquals } from "@std/assert/equals";
import { buttonPresses, parseInput } from "./claw.ts";

const example = `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`;

Deno.test(function exampleClawMachines() {
  assertEquals(
    parseInput(example),
    [{
      buttons: [
        {
          name: "A",
          x: 94,
          y: 34,
        },
        {
          name: "B",
          x: 22,
          y: 67,
        },
      ],
      prize: {
        x: 8400,
        y: 5400,
      },
    }, {
      buttons: [
        {
          name: "A",
          x: 26,
          y: 66,
        },
        {
          name: "B",
          x: 67,
          y: 21,
        },
      ],
      prize: {
        x: 12748,
        y: 12176,
      },
    }, {
      buttons: [
        {
          name: "A",
          x: 17,
          y: 86,
        },
        {
          name: "B",
          x: 84,
          y: 37,
        },
      ],
      prize: {
        x: 7870,
        y: 6450,
      },
    }, {
      buttons: [
        {
          name: "A",
          x: 69,
          y: 23,
        },
        {
          name: "B",
          x: 27,
          y: 71,
        },
      ],
      prize: {
        x: 18641,
        y: 10279,
      },
    }],
  );
});

Deno.test(function exampleClawMachines() {
  assertEquals(
    parseInput(example).map(buttonPresses),
    [],
  );
});
