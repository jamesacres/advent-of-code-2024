import { assertEquals } from "@std/assert/equals";
import { wordsearch } from "./wordsearch.ts";

Deno.test(async function testFilterDonts() {
  const count = wordsearch(
    "XMAS",
    [
      "MMMSXXMASM",
      "MSAMXMSMSA",
      "AMXSXMAAMM",
      "MSAMASMSMX",
      "XMASAMXAMM",
      "XXAMMXXAMA",
      "SMSMSASXSS",
      "SAXAMASAAA",
      "MAMMMXMMMM",
      "MXMXAXMASX",
    ],
  );
  assertEquals(count, 18);
});

Deno.test(async function testFilterDonts() {
  const input = await Deno.readTextFile("./4/input.txt");
  const lines = input.split("\n");
  const count = wordsearch(
    "XMAS",
    lines,
  );
  assertEquals(count, 2536);
});
