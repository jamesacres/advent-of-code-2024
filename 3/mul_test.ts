import { assertEquals } from "@std/assert";
import { extractMul, filterDonts, runMul } from "./mul.ts";

Deno.test(async function testSumMuls() {
  const input = await Deno.readTextFile("./3/input.txt");
  const lines = input.split("\n");
  const inputString = lines.join("");
  const muls = extractMul(inputString);
  const total = muls.map((mul) => runMul(String(mul))).reduce(
    (result, number) => result + number,
    0,
  );
  assertEquals(total, 166630675);
});

Deno.test(async function testFilterDonts() {
  const input = await Deno.readTextFile("./3/input.txt");
  const lines = input.split("\n");
  const inputString = lines.join("");
  const filteredInputString = filterDonts(inputString);
  assertEquals(filteredInputString.includes(`don't()`), false);
  assertEquals(filteredInputString.includes(`mul(195,249)`), false);
  assertEquals(filteredInputString.includes(`mul(316,793)`), true);
});

Deno.test(async function testFilterDontsSumMuls() {
  const input = await Deno.readTextFile("./3/input.txt");
  const lines = input.split("\n");
  const inputString = lines.join("");
  const filteredInputString = filterDonts(inputString);
  const muls = extractMul(filteredInputString);
  const total = muls.map((mul) => runMul(String(mul))).reduce(
    (result, number) => result + number,
    0,
  );
  assertEquals(total, 93465710);
});
