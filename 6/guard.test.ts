import { assertEquals } from "@std/assert/equals";
import {
  getMap,
  getVisitedCount,
  getVisitedMap,
  mapToString,
  State,
} from "./guard.ts";
import { assertThrows } from "@std/assert/throws";

const example = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;

Deno.test(function exampleStringToMap() {
  assertEquals(mapToString(getMap(example)), example);
});

Deno.test(function exampleStringToVisitedMap() {
  assertEquals(
    mapToString(getVisitedMap(getMap(example))),
    `0000000000
0000111110
0000100010
0000100010
0011211010
0010101010
0011212110
0111112100
0111111100
0000000100`,
  );
});

Deno.test(function exampleStringToVisitedCount() {
  assertEquals(
    getVisitedCount(getVisitedMap(getMap(example))),
    41,
  );
});

Deno.test(async function inputStringToVisitedCount() {
  const input = await Deno.readTextFile("./6/input.txt");

  assertEquals(
    getVisitedCount(getVisitedMap(getMap(input))),
    5531,
  );
});

Deno.test(function exampleLoop() {
  const map = getMap(example);
  map[3][6] = State.OBSTACLE;
  assertThrows(
    () => getVisitedMap(map),
    Error,
    "loop detected",
  );
});

Deno.test(function exampleCountLoopPositions() {
  const map = getMap(example);
  const maxx = Object.keys(map).length;
  const maxy = Object.keys(map[0]).length;
  let loopPositions = 0;
  [...new Array(maxy)].map((_, y) => {
    [...new Array(maxx)].map((_, x) => {
      if (map[x][y] !== State.OBSTACLE) {
        const modifiedMap = getMap(example);
        modifiedMap[x][y] = State.OBSTACLE;
        try {
          getVisitedMap(modifiedMap);
        } catch (e) {
          if (e instanceof Error && e.message === "loop detected") {
            loopPositions = loopPositions + 1;
          }
        }
      }
    });
  });

  assertEquals(loopPositions, 6);
});

Deno.test(async function inputCountLoopPositions() {
  const input = await Deno.readTextFile("./6/input.txt");
  const map = getMap(input);
  const maxx = Object.keys(map).length;
  const maxy = Object.keys(map[0]).length;
  let loopPositions = 0;
  [...new Array(maxy)].map((_, y) => {
    [...new Array(maxx)].map((_, x) => {
      if (map[x][y] !== State.OBSTACLE) {
        const modifiedMap = getMap(input);
        modifiedMap[x][y] = State.OBSTACLE;
        try {
          getVisitedMap(modifiedMap);
        } catch (e) {
          if (e instanceof Error && e.message === "loop detected") {
            loopPositions = loopPositions + 1;
          }
        }
      }
    });
  });

  assertEquals(loopPositions, 2165);
});
