import { assertEquals } from "@std/assert";
import { extractMul, runMul } from "./mul.ts";

Deno.test(async function safeTotalWithInput() {
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
