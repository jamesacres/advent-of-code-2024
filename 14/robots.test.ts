import { assertEquals } from "@std/assert/equals";
import { move, parseInput, quadrants } from "./robots.ts";

const example = `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`;

Deno.test(function exampleNewRobotPositions() {
  assertEquals(
    move(parseInput(example), 100, [11, 7]),
    {
      "0,2": 1,
      "1,3": 1,
      "1,6": 1,
      "2,3": 1,
      "3,5": 1,
      "4,5": 2,
      "5,4": 1,
      "6,0": 2,
      "6,6": 1,
      "9,0": 1,
    },
  );
});

Deno.test(function exampleNewRobotQuadrants() {
  assertEquals(
    quadrants(move(parseInput(example), 100, [11, 7]), [11, 7]),
    {
      q1: 1,
      q2: 3,
      q3: 4,
      q4: 1,
    },
  );
});

Deno.test(function exampleNewSafetyFactor() {
  assertEquals(
    Object.values(quadrants(move(parseInput(example), 100, [11, 7]), [11, 7]))
      .reduce((result, count) => result * count, 1),
    12,
  );
});

Deno.test(async function inputNewSafetyFactor() {
  const input = await Deno.readTextFile("./14/input.txt");
  assertEquals(
    Object.values(
      quadrants(move(parseInput(input), 100, [101, 103]), [101, 103]),
    )
      .reduce((result, count) => result * count, 1),
    217132650,
  );
});
