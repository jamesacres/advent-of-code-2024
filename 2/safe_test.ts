import { assertEquals } from "@std/assert";
import { checkIsSafe } from "./safe.ts";

Deno.test(async function safeTotalWithInput() {
  const input = await Deno.readTextFile("./2/input.txt");
  const safeCount = input.split("\n").map((line) => line.split(/\s+/))
    .reduce(
      (result, numbers) => {
        const isSafe = checkIsSafe(numbers.map(Number));
        return isSafe ? result + 1 : result;
      },
      0,
    );
  assertEquals(safeCount, 598);
});
