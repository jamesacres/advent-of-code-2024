import { assertEquals } from "@std/assert";
import { checkIsSafe, checkIsSafeDampener } from "./safe.ts";

Deno.test(async function safeTotalWithInput() {
  const input = await Deno.readTextFile("./2/input.txt");
  const safeCount = input.split("\n").map((line) => line.split(/\s+/))
    .reduce(
      (result, numbers) => {
        const isSafe = checkIsSafe(numbers.map(Number)).safe;
        return isSafe ? result + 1 : result;
      },
      0,
    );
  assertEquals(safeCount, 598);
});

Deno.test(function dampenerSafeWithExample1() {
  assertEquals(checkIsSafeDampener([7, 6, 4, 2, 1]), true);
});

Deno.test(function dampenerSafeWithExample2() {
  assertEquals(checkIsSafeDampener([1, 2, 7, 8, 9]), false);
});

Deno.test(function dampenerSafeWithExample3() {
  assertEquals(checkIsSafeDampener([9, 7, 6, 2, 1]), false);
});

Deno.test(function dampenerSafeWithExample4() {
  assertEquals(checkIsSafeDampener([1, 3, 2, 4, 5]), true);
});

Deno.test(function dampenerSafeWithExample5() {
  assertEquals(checkIsSafeDampener([8, 6, 4, 4, 1]), true);
});

Deno.test(function dampenerSafeWithExample6() {
  assertEquals(checkIsSafeDampener([1, 3, 6, 7, 9]), true);
});

Deno.test(function dampenerSafeWithChangeInDirection() {
  assertEquals(checkIsSafeDampener([5, 4, 6, 7, 8]), true);
});

Deno.test(function dampenerSafeWithChangeInDirectionTwice() {
  assertEquals(checkIsSafeDampener([5, 4, 6, 7, 6, 8]), false);
});

Deno.test(function dampenerSafeWithBadStart() {
  assertEquals(checkIsSafeDampener([7, 4, 5, 6]), true);
});

Deno.test(async function dampenerSafeTotalWithInput() {
  const input = await Deno.readTextFile("./2/input.txt");
  const safeCount = input.split("\n").map((line) => line.split(/\s+/))
    .reduce(
      (result, numbers) => {
        const isSafe = checkIsSafeDampener(numbers.map(Number));
        return isSafe ? result + 1 : result;
      },
      0,
    );
  assertEquals(safeCount, 634);
});
