import { assertEquals } from "@std/assert/equals";
import {
  getMap,
  getVisitedCount,
  getVisitedMap,
  mapToString,
} from "./guard.ts";

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
