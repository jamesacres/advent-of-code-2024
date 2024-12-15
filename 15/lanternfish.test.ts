import { assertEquals } from "@std/assert/equals";
import { mapSumGPS, mapToString, move, parseInput } from "./lanternfish.ts";

const example = `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^
`;

Deno.test(function exampleMap() {
  const { map, initialRobotPosition, directions } = parseInput(example);
  assertEquals(
    mapToString(move(map, initialRobotPosition, directions)),
    `##########
#.O.O.OOO#
#........#
#OO......#
#OO@.....#
#O#.....O#
#O.....OO#
#O.....OO#
#OO....OO#
##########`,
  );
});

Deno.test(function exampleSumGPS() {
  const { map, initialRobotPosition, directions } = parseInput(example);
  assertEquals(
    mapSumGPS(move(map, initialRobotPosition, directions)),
    10092,
  );
});

Deno.test(async function inputNewSafetyFactor() {
  const input = await Deno.readTextFile("./15/input.txt");
  const { map, initialRobotPosition, directions } = parseInput(input);
  assertEquals(
    mapSumGPS(move(map, initialRobotPosition, directions)),
    1430536,
  );
});

Deno.test(function exampleMapV2ToString() {
  const { map } = parseInput(example, true);
  assertEquals(
    mapToString(map),
    `####################
##....[]....[]..[]##
##............[]..##
##..[][]....[]..[]##
##....[]@.....[]..##
##[]##....[]......##
##[]....[]....[]..##
##..[][]..[]..[][]##
##........[]......##
####################`,
  );
});

Deno.test(function exampleMapV2() {
  const { map, initialRobotPosition, directions } = parseInput(example, true);
  assertEquals(
    mapToString(move(map, initialRobotPosition, directions)),
    `####################
##[].......[].[][]##
##[]...........[].##
##[]........[][][]##
##[]......[]....[]##
##..##......[]....##
##..[]............##
##..@......[].[][]##
##......[][]..[]..##
####################`,
  );
});

Deno.test(function exampleNewSafetyFactorV2() {
  const { map, initialRobotPosition, directions } = parseInput(example, true);
  assertEquals(
    mapSumGPS(move(map, initialRobotPosition, directions)),
    9021,
  );
});

Deno.test(async function inputNewSafetyFactorV2() {
  const input = await Deno.readTextFile("./15/input.txt");
  const { map, initialRobotPosition, directions } = parseInput(input, true);
  assertEquals(
    mapSumGPS(move(map, initialRobotPosition, directions)),
    1452348,
  );
});
