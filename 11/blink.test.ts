import { assertEquals } from "@std/assert/equals";
import { blink } from "./blink.ts";

const example = "125 17";

Deno.test(function exampleBlink() {
  let input = example;
  const results = [...new Array(6)].map(() => input = blink(input));
  assertEquals(results, [
    "253000 1 7",
    "253 0 2024 14168",
    "512072 1 20 24 28676032",
    "512 72 2024 2 0 2 4 2867 6032",
    "1036288 7 2 20 24 4048 1 4048 8096 28 67 60 32",
    "2097446912 14168 4048 2 0 2 4 40 48 2024 40 48 80 96 2 8 6 7 6 0 3 2",
  ]);
});

Deno.test(function exampleBlinkStoneCount() {
  let input = example;
  const results = [...new Array(6)].map(() => input = blink(input));
  assertEquals(results[results.length - 1].split(" ").length, 22);
});

Deno.test(function exampleBlinkStoneCount() {
  let input = example;
  const results = [...new Array(25)].map(() => input = blink(input));
  assertEquals(results[results.length - 1].split(" ").length, 55312);
});

Deno.test(async function exampleBlinkStoneCount() {
  let input = await Deno.readTextFile("./11/input.txt");
  const results = [...new Array(25)].map(() => input = blink(input));
  assertEquals(results[results.length - 1].split(" ").length, 186175);
});
