import { assertEquals } from "@std/assert/equals";
import { wordsearch, xsearch } from "./wordsearch.ts";

Deno.test(function testWordsearch() {
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

Deno.test(async function testWordsearchInput() {
  const input = await Deno.readTextFile("./4/input.txt");
  const lines = input.split("\n");
  const count = wordsearch(
    "XMAS",
    lines,
  );
  assertEquals(count, 2536);
});

Deno.test(function testXsearch() {
  const count = xsearch(
    "MAS", // trying to find an X of MAS
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
  assertEquals(count, 9);
});

Deno.test(async function testWordsearchInput() {
  const input = await Deno.readTextFile("./4/input.txt");
  const lines = input.split("\n");
  const count = xsearch(
    "MAS", // trying to find an X of MAS
    lines,
  );
  assertEquals(count, 1875);
});
