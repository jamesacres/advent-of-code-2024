import { assertEquals } from "@std/assert/equals";
import {
  countAntinodes,
  getMap,
  mapToString,
  setAntinodes,
} from "./antenna.ts";

const example = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`;

Deno.test(function exampleStringToMap() {
  assertEquals(mapToString(getMap(example)), example);
});

Deno.test(function exampleStringWithAntinodes() {
  const map = getMap(example);
  setAntinodes(map);
  assertEquals(
    mapToString(map),
    `......#....#
...#....0...
....#0....#.
..#....0....
....0....#..
.#....A.....
...#........
#......#....
........A...
.........A..
..........#.
..........#.`,
  );
});

Deno.test(function exampleStringWithAntinodesCount() {
  const map = getMap(example);
  setAntinodes(map);
  assertEquals(
    countAntinodes(map),
    14,
  );
});

Deno.test(async function inputStringWithAntinodes() {
  const input = await Deno.readTextFile("./8/input.txt");
  const map = getMap(input);
  setAntinodes(map);
  assertEquals(
    countAntinodes(map),
    394,
  );
});
