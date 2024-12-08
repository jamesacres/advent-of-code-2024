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

Deno.test(async function inputStringWithAntinodesCount() {
  const input = await Deno.readTextFile("./8/input.txt");
  const map = getMap(input);
  setAntinodes(map);
  assertEquals(
    countAntinodes(map),
    394,
  );
});

Deno.test(function exampleStringWithAntinodesExtended() {
  const map = getMap(example);
  setAntinodes(map, true);
  assertEquals(
    mapToString(map),
    `##....#....#
.#.#....0...
..#.#0....#.
..##...0....
....0....#..
.#...#A....#
...#..#.....
#....#.#....
..#.....A...
....#....A..
.#........#.
...#......##`,
  );
});

Deno.test(function exampleStringWithAntinodesExtendedCount() {
  const map = getMap(example);
  setAntinodes(map, true);
  assertEquals(
    countAntinodes(map),
    34,
  );
});

Deno.test(async function inputStringWithAntinodesExtendedCount() {
  const input = await Deno.readTextFile("./8/input.txt");
  const map = getMap(input);
  setAntinodes(map, true);
  assertEquals(
    countAntinodes(map),
    1277,
  );
});
