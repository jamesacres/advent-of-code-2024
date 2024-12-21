import { assertEquals } from "@std/assert/equals";
import { getMaze, mazeToString, reverseMaze, solveMaze } from "./maze.ts";

const example = `###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`;

const example2 = `#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`;

Deno.test(function example1MinScore() {
  const { map, startPosition, endPosition } = getMaze(example);
  solveMaze(map, startPosition);
  console.info(mazeToString(map, map[endPosition[0]][endPosition[1]].path));
  assertEquals(
    map[endPosition[0]][endPosition[1]].distance,
    7036,
  );
});

Deno.test(function example2MinScore() {
  const { map, startPosition, endPosition } = getMaze(example2);
  solveMaze(map, startPosition);
  console.info(mazeToString(map, map[endPosition[0]][endPosition[1]].path));
  assertEquals(
    map[endPosition[0]][endPosition[1]].distance,
    11048,
  );
});

Deno.test(async function inputMinScore() {
  const input = await Deno.readTextFile("./16/input.txt");
  const { map, startPosition, endPosition } = getMaze(input);
  solveMaze(map, startPosition);
  console.info(mazeToString(map, map[endPosition[0]][endPosition[1]].path));
  assertEquals(
    map[endPosition[0]][endPosition[1]].distance! - 4,
    72428,
  );
});
