import { assertEquals } from "@std/assert/equals";
import { blink, stringToStoneCount } from "./blink.ts";

const example = "125 17";

Deno.test(function exampleBlinkStoneCount6() {
  assertEquals(
    blink(stringToStoneCount(example), 6),
    22,
  );
});

Deno.test(function exampleBlinkStoneCount25() {
  assertEquals(
    blink(stringToStoneCount(example), 25),
    55312,
  );
});

Deno.test(async function part1BlinkStoneCount() {
  assertEquals(
    blink(stringToStoneCount(await Deno.readTextFile("./11/input.txt")), 25),
    186175,
  );
});

Deno.test(async function part2BlinkStoneCount() {
  assertEquals(
    blink(stringToStoneCount(await Deno.readTextFile("./11/input.txt")), 75),
    220566831337810,
  );
});
